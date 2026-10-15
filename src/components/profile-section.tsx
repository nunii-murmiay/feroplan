"use client";

import { useProfile } from "@/components/profile-provider";
import type { ActivityLevel, CyclePhase } from "@/lib/profile";

const activities: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Сидячий" },
  { value: "light", label: "Лёгкий (дом 2–3×)" },
  { value: "moderate", label: "Средний" },
  { value: "active", label: "Активный" },
];

const phases: { value: CyclePhase; label: string }[] = [
  { value: "follicular", label: "Фолликулярная" },
  { value: "ovulation", label: "Овуляция" },
  { value: "luteal", label: "ПМС" },
  { value: "menstruation", label: "Месячные" },
  { value: "unknown", label: "Не знаю" },
];

export function ProfileSection() {
  const { ready, profile, plan, syncLabel, setProfile } = useProfile();

  if (!ready) {
    return (
      <section id="profile" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-muted-foreground">Считаем твой план…</p>
      </section>
    );
  }

  return (
    <section
      id="profile"
      className="border-b border-border/60 bg-sand/40 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
            00 · Твой профиль
          </p>
          <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
            Параметры → живой план
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Меняешь вес, цикл, сон или отмечаешь болезнь — калории, граммы и
            тренировки пересчитываются сразу. Сейчас заложено похудение{" "}
            {profile.weightKg} → {profile.goalWeightKg} кг.
          </p>
          <p className="mt-2 text-sm text-moss">{syncLabel}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 rounded-2xl bg-card/80 p-5 sm:p-6">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-moss">
                Имя
              </span>
              <input
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none ring-moss focus:ring-2"
                value={profile.nickname}
                placeholder="как к тебе обращаться"
                onChange={(e) => setProfile({ nickname: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <NumField
                label="Возраст"
                value={profile.age}
                min={14}
                max={80}
                onChange={(age) => setProfile({ age })}
              />
              <NumField
                label="Рост, см"
                value={profile.heightCm}
                min={120}
                max={220}
                onChange={(heightCm) => setProfile({ heightCm })}
              />
              <NumField
                label="Вес, кг"
                value={profile.weightKg}
                min={35}
                max={200}
                step={0.1}
                onChange={(weightKg) => setProfile({ weightKg })}
              />
              <NumField
                label="Цель, кг"
                value={profile.goalWeightKg}
                min={35}
                max={200}
                step={0.1}
                onChange={(goalWeightKg) => setProfile({ goalWeightKg })}
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-moss">
                Активность
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activities.map((a) => (
                  <Chip
                    key={a.value}
                    active={profile.activity === a.value}
                    onClick={() => setProfile({ activity: a.value })}
                  >
                    {a.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-moss">
                Фаза цикла
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {phases.map((p) => (
                  <Chip
                    key={p.value}
                    active={profile.cyclePhase === p.value}
                    onClick={() => setProfile({ cyclePhase: p.value })}
                  >
                    {p.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-moss">
                Сон сегодня: {profile.sleepHours} ч
              </p>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={profile.sleepHours}
                onChange={(e) =>
                  setProfile({ sleepHours: Number(e.target.value) })
                }
                className="mt-3 w-full accent-pine"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={profile.isSick}
                  onChange={(e) => setProfile({ isSick: e.target.checked })}
                  className="accent-pine"
                />
                Сейчас болею / восстанавливаюсь
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={profile.lowFerritin}
                  onChange={(e) =>
                    setProfile({ lowFerritin: e.target.checked })
                  }
                  className="accent-pine"
                />
                Низкий ферритин
              </label>
            </div>
          </div>

          <aside className="rounded-2xl bg-pine p-5 text-sand sm:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-sand/60">
              Сегодняшняя норма
            </p>
            <p className="mt-3 font-display text-5xl leading-none">
              {plan.targetKcal}
              <span className="ml-2 text-2xl text-sand/70">ккал</span>
            </p>
            <p className="mt-3 text-sm text-sand/75">
              BMR {plan.bmr} · поддержка {plan.tdee} · масштаб порций ×
              {plan.portionScale}
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Stat label="Белки" value={`${plan.proteinG} г`} />
              <Stat label="Жиры" value={`${plan.fatG} г`} />
              <Stat label="Углеводы" value={`${plan.carbsG} г`} />
            </dl>

            <ul className="mt-6 space-y-2 text-sm text-sand/85">
              <li>· Цикл: {plan.labels.cycle}</li>
              <li>· {plan.labels.sleep}</li>
              <li>· {plan.labels.health}</li>
              {plan.weeksToGoal ? (
                <li>
                  · Ориентир до цели: ~{plan.weeksToGoal} нед. (−
                  {plan.weeklyLossKg} кг/нед)
                </li>
              ) : null}
            </ul>

            <div className="mt-6 space-y-3 border-t border-sand/15 pt-5 text-sm leading-relaxed">
              <p>
                <span className="text-sand/60">Еда: </span>
                {plan.nutritionNote}
              </p>
              <p>
                <span className="text-sand/60">Тренировки: </span>
                {plan.trainingNote}
              </p>
            </div>

            {plan.warnings.length > 0 ? (
              <ul className="mt-5 space-y-1.5 text-xs text-sand/70">
                {plan.warnings.map((w) => (
                  <li key={w}>! {w}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function NumField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs uppercase tracking-wider text-moss">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none ring-moss focus:ring-2"
      />
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active ? "bg-pine text-sand" : "bg-sand/80 text-pine hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sand/10 px-2 py-3">
      <dt className="text-[10px] uppercase tracking-wider text-sand/55">
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg">{value}</dd>
    </div>
  );
}
