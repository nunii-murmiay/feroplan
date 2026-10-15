export type CyclePhase =
  | "follicular"
  | "ovulation"
  | "luteal"
  | "menstruation"
  | "unknown";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active";

export type UserProfile = {
  nickname: string;
  sex: "female" | "male";
  age: number;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  activity: ActivityLevel;
  cyclePhase: CyclePhase;
  sleepHours: number;
  isSick: boolean;
  lowFerritin: boolean;
};

export type MacroPlan = {
  bmr: number;
  tdee: number;
  targetKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  portionScale: number;
  weeklyLossKg: number;
  weeksToGoal: number | null;
  trainingNote: string;
  nutritionNote: string;
  warnings: string[];
  labels: {
    cycle: string;
    sleep: string;
    health: string;
  };
};

export const defaultProfile = (): UserProfile => ({
  nickname: "",
  sex: "female",
  age: 20,
  heightCm: 164,
  weightKg: 64,
  goalWeightKg: 60,
  activity: "light",
  cyclePhase: "unknown",
  sleepHours: 7,
  isSick: false,
  lowFerritin: true,
});

const activityFactor: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const cycleLabel: Record<CyclePhase, string> = {
  follicular: "Фолликулярная",
  ovulation: "Овуляция",
  luteal: "ПМС / лютеиновая",
  menstruation: "Менструация",
  unknown: "Не указана",
};

/** Mifflin–St Jeor */
export function calcBmr(profile: UserProfile): number {
  const { weightKg, heightCm, age, sex } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "female" ? base - 161 : base + 5);
}

export function calcTdee(profile: UserProfile): number {
  return Math.round(calcBmr(profile) * activityFactor[profile.activity]);
}

/**
 * Soft deficit for fat loss, adapted for cycle / sleep / illness.
 * Never drops below ~BMR * 1.05 for young women with iron issues.
 */
export function buildMacroPlan(profile: UserProfile): MacroPlan {
  const bmr = calcBmr(profile);
  const tdee = calcTdee(profile);
  const warnings: string[] = [];

  const delta = profile.weightKg - profile.goalWeightKg;
  const wantsLoss = delta > 0.3;
  const wantsGain = delta < -0.3;

  // Base target
  let target = tdee;
  if (wantsLoss) {
    // ~0.3–0.5 kg/week → 300–500 kcal deficit, capped
    const rawDeficit = Math.min(500, Math.max(250, delta * 80));
    target = tdee - rawDeficit;
  } else if (wantsGain) {
    target = tdee + 250;
  }

  // Floor for energy availability (important with low ferritin)
  const floor = Math.round(bmr * 1.08);
  if (target < floor) {
    target = floor;
    warnings.push(
      "Калории не опускаем ниже безопасного минимума — особенно при низком ферритине.",
    );
  }

  let trainingNote =
    "Обычный план: 3–4 домашние тренировки + 1 зал по самочувствию.";
  let nutritionNote =
    "Держим белок и железо каждый день. Сладкое — по стратегии добавления, не запрета.";

  // Cycle adaptations
  switch (profile.cyclePhase) {
    case "luteal":
      target += 100;
      trainingNote =
        "ПМС: снизь HIIT, больше танцев/йоги/лёгкой силы. Силовые — по желанию.";
      nutritionNote =
        "Чуть больше сложных углеводов и магния (гречка, какао, семечки). Заранее заложи 1–2 десерта.";
      break;
    case "menstruation":
      target += 80;
      trainingNote =
        "Менструация: прогулки, йога, мягкая мобильность. Зал можно перенести.";
      nutritionNote =
        "Приоритет железу (печень/говядина/гречка + витамин C), тёплые супы и каши. Не режь калории.";
      break;
    case "follicular":
      trainingNote =
        "Фолликулярная: лучшее окно для силы, HIIT и зала. Можно чуть интенсивнее.";
      break;
    case "ovulation":
      trainingNote =
        "Овуляция: обычно пик сил — full body в зале и танцы отлично заходят.";
      break;
    default:
      break;
  }

  // Sleep adaptations
  let sleepLabel = `${profile.sleepHours} ч сна`;
  if (profile.sleepHours < 6) {
    target += 50;
    sleepLabel = `Мало сна (${profile.sleepHours} ч)`;
    trainingNote =
      "Недосып: только лёгкая мобильность или прогулка. Восстановление важнее калорийного героизма.";
    nutritionNote =
      "При недосыпе сильнее тяга к сладкому — сначала белок+углевод, потом осознанный десерт. Ложись раньше, если можешь.";
    warnings.push("Меньше 6 часов сна: не усиливай дефицит и интенсивность.");
  } else if (profile.sleepHours < 7) {
    sleepLabel = `Сон на грани (${profile.sleepHours} ч)`;
    trainingNote += " Сегодня лучше средняя интенсивность, не рекорды.";
  } else if (profile.sleepHours >= 8) {
    sleepLabel = `Сон хороший (${profile.sleepHours} ч)`;
  }

  // Illness
  let healthLabel = "Здорова";
  if (profile.isSick) {
    healthLabel = "Болею / восстанавливаюсь";
    target = Math.max(target, Math.round(tdee * 0.95));
    trainingNote =
      "Болезнь: полный отдых или только дыхание/лёгкая растяжка в кровати. Вернёшься к плану после 1–2 дней нормального самочувствия.";
    nutritionNote =
      "Лёгкая тёплая еда, суп, каша, яйца, больше жидкости. Не считай «срыв», если аппетит странный.";
    warnings.push("Во время болезни цель — выздоровление, не дефицит.");
  }

  if (profile.lowFerritin) {
    warnings.push(
      "Низкий ферритин: не сочетай железо с чаем/кофе/молочкой в одном приёме; обсуди добавки с врачом.",
    );
  }

  // Macros: higher protein while cutting
  const proteinG = Math.round(
    profile.weightKg * (wantsLoss ? 1.7 : 1.5),
  );
  const fatG = Math.round((target * 0.28) / 9);
  const carbsG = Math.max(
    80,
    Math.round((target - proteinG * 4 - fatG * 9) / 4),
  );

  // Scale portions vs a ~1700 kcal reference menu
  const portionScale = Math.round((target / 1700) * 100) / 100;

  // Rough weekly loss estimate (7700 kcal ≈ 1 kg)
  const dailyDeficit = wantsLoss ? Math.max(0, tdee - target) : 0;
  const weeklyLossKg =
    Math.round((dailyDeficit * 7) / 7700 * 100) / 100;
  const weeksToGoal =
    wantsLoss && weeklyLossKg > 0
      ? Math.ceil(delta / weeklyLossKg)
      : null;

  return {
    bmr,
    tdee,
    targetKcal: Math.round(target),
    proteinG,
    fatG,
    carbsG,
    portionScale,
    weeklyLossKg,
    weeksToGoal,
    trainingNote,
    nutritionNote,
    warnings,
    labels: {
      cycle: cycleLabel[profile.cyclePhase],
      sleep: sleepLabel,
      health: healthLabel,
    },
  };
}

/** Scale a dry-grain or protein gram amount by portionScale */
export function scaleGrams(
  grams: number,
  scale: number,
  min = 20,
  max = 400,
): number {
  return Math.round(Math.min(max, Math.max(min, grams * scale)));
}

export function scaleGramRange(text: string, scale: number): string {
  if (Math.abs(scale - 1) < 0.02) return text;

  // Protect ranges first, then single "N г"
  const ranges: string[] = [];
  const withRanges = text.replace(
    /(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)\s*г/g,
    (_, a, b) => {
      const lo = scaleGrams(parseFloat(String(a).replace(",", ".")), scale);
      const hi = scaleGrams(parseFloat(String(b).replace(",", ".")), scale);
      const token = `__R${ranges.length}__`;
      ranges.push(`${lo}–${hi} г`);
      return token;
    },
  );

  const scaled = withRanges.replace(/(\d+(?:[.,]\d+)?)\s*г/g, (_, n) => {
    const v = scaleGrams(parseFloat(String(n).replace(",", ".")), scale);
    return `${v} г`;
  });

  return ranges.reduce(
    (acc, value, i) => acc.replace(`__R${i}__`, value),
    scaled,
  );
}
