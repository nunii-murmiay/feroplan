"use client";

import { weeklyMenu } from "@/data/nutrition";
import { useProfile } from "@/components/profile-provider";
import { mealSlots, type MealSlotKey } from "@/lib/progress";

export function ProgressSection() {
  const { ready, payload, setPayload, syncLabel, plan } = useProfile();

  const setChoice = (day: string, slot: MealSlotKey, option: number) => {
    const current = payload.mealChoices[day]?.[slot];
    const nextValue = current === option ? undefined : option;
    const dayChoices = { ...payload.mealChoices[day], [slot]: nextValue };
    setPayload({
      ...payload,
      mealChoices: { ...payload.mealChoices, [day]: dayChoices },
    });
  };

  if (!ready) {
    return (
      <section id="progress" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-muted-foreground">Загружаем прогресс…</p>
      </section>
    );
  }

  return (
    <section
      id="progress"
      className="border-t border-border/60 bg-mist/30 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
            05 · Моя база
          </p>
          <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
            Личный прогресс
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Отмечай выбранные блюда и заметки. Норма сегодня:{" "}
            <strong className="text-pine">{plan.targetKcal} ккал</strong> (порции
            ×{plan.portionScale}). {syncLabel}.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-2xl bg-card/80 p-5 sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-moss">
                Неделя плана
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((week) => (
                  <button
                    key={week}
                    type="button"
                    onClick={() => setPayload({ ...payload, week })}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      payload.week === week
                        ? "bg-pine text-sand"
                        : "bg-sand/80 text-pine hover:bg-sand"
                    }`}
                  >
                    {week}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-moss">
                Напоминание про ферритин
              </span>
              <input
                type="date"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-moss focus:ring-2"
                value={payload.ferritinReminder}
                onChange={(e) =>
                  setPayload({ ...payload, ferritinReminder: e.target.value })
                }
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-moss">
                Заметки недели
              </span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-moss focus:ring-2"
                placeholder="Энергия, тяга, что зашло…"
                value={payload.notes}
                onChange={(e) =>
                  setPayload({ ...payload, notes: e.target.value })
                }
              />
            </label>
          </div>

          <div className="rounded-2xl bg-pine p-5 text-sand sm:p-6">
            <h3 className="font-display text-xl">Выбор блюд на неделю</h3>
            <p className="mt-1 text-sm text-sand/70">
              1 или 2 — какой вариант из меню берёшь
            </p>
            <div className="mt-5 max-h-[28rem] space-y-4 overflow-y-auto pr-1">
              {weeklyMenu.map((day) => (
                <div
                  key={day.short}
                  className="border-t border-sand/15 pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="font-medium">
                    {day.day}{" "}
                    <span className="text-sand/60">· {day.focus}</span>
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {mealSlots.map((slot, index) => {
                      const meal = day.meals[index];
                      if (!meal) return null;
                      const selected =
                        payload.mealChoices[day.short]?.[slot.key];
                      return (
                        <div key={slot.key} className="text-sm">
                          <p className="text-sand/65">{slot.label}</p>
                          <div className="mt-1 flex gap-2">
                            {[1, 2].map((option) => {
                              if (!meal.options[option - 1]) return null;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  title={meal.options[option - 1]?.title}
                                  onClick={() =>
                                    setChoice(day.short, slot.key, option)
                                  }
                                  className={`rounded-md px-2.5 py-1 text-xs transition ${
                                    selected === option
                                      ? "bg-sand text-pine"
                                      : "bg-sand/15 hover:bg-sand/25"
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          {selected ? (
                            <p className="mt-1 text-xs text-sand/75">
                              {meal.options[selected - 1]?.title}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
