"use client";

import { useEffect, useState, useTransition } from "react";
import { weeklyMenu } from "@/data/nutrition";
import type { ProgressPayload } from "@/db/schema";
import {
  STORAGE_KEY,
  USER_ID_KEY,
  createUserId,
  defaultPayload,
  mealSlots,
  type MealSlotKey,
} from "@/lib/progress";

type SyncMode = "local" | "cloud" | "unknown";

export function ProgressSection() {
  const [payload, setPayload] = useState<ProgressPayload>(defaultPayload);
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState<SyncMode>("unknown");
  const [statusText, setStatusText] = useState("Загрузка…");
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = createUserId();
      localStorage.setItem(USER_ID_KEY, id);
    }
    setUserId(id);

    const raw = localStorage.getItem(STORAGE_KEY);
    const local = raw
      ? ({ ...defaultPayload(), ...JSON.parse(raw) } as ProgressPayload)
      : defaultPayload();
    setPayload(local);

    startTransition(async () => {
      try {
        const statusRes = await fetch("/api/status");
        const status = (await statusRes.json()) as { cloud?: boolean };

        if (!status.cloud) {
          setMode("local");
          setStatusText("Локальная база в браузере · облако не подключено");
          setReady(true);
          return;
        }

        const res = await fetch(`/api/progress?id=${encodeURIComponent(id!)}`);
        const data = (await res.json()) as {
          mode: SyncMode;
          payload: ProgressPayload | null;
        };

        if (data.mode === "cloud" && data.payload) {
          const merged = { ...defaultPayload(), ...data.payload };
          setPayload(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setMode("cloud");
          setStatusText("Синхронизировано с Neon Postgres");
        } else if (data.mode === "cloud") {
          setMode("cloud");
          setStatusText("Облако готово · пока сохранено локально");
        } else {
          setMode("local");
          setStatusText("Локальная база в браузере");
        }
      } catch {
        setMode("local");
        setStatusText("Офлайн · сохраняем только в браузере");
      } finally {
        setReady(true);
      }
    });
  }, []);

  const persist = (next: ProgressPayload) => {
    setPayload(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    if (!userId) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, payload: next }),
        });
        const data = (await res.json()) as {
          mode: SyncMode;
          saved?: boolean;
          message?: string;
          error?: string;
        };

        if (data.mode === "cloud" && data.saved) {
          setMode("cloud");
          setStatusText("Сохранено в облаке Neon");
        } else {
          setMode("local");
          setStatusText(data.message ?? data.error ?? "Сохранено локально");
        }
      } catch {
        setStatusText("Сохранено локально (сеть недоступна)");
      }
    });
  };

  const setChoice = (day: string, slot: MealSlotKey, option: number) => {
    const current = payload.mealChoices[day]?.[slot];
    const nextValue = current === option ? undefined : option;
    const dayChoices = { ...payload.mealChoices[day], [slot]: nextValue };
    persist({
      ...payload,
      mealChoices: { ...payload.mealChoices, [day]: dayChoices },
    });
  };

  if (!ready) {
    return (
      <section id="progress" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-muted-foreground">Загружаем твой прогресс…</p>
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
            Отмечай выбранные блюда, неделю плана и заметки. По умолчанию всё
            хранится в браузере. Если подключить бесплатный Neon — появится
            облачная Postgres-база.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`rounded-full px-3 py-1 ${
              mode === "cloud"
                ? "bg-pine text-sand"
                : "bg-sand text-pine"
            }`}
          >
            {mode === "cloud" ? "Облако Neon" : "Локально"}
          </span>
          <span className="text-muted-foreground">
            {pending ? "Сохраняем…" : statusText}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-2xl bg-card/80 p-5 sm:p-6">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-moss">
                Как к тебе обращаться
              </span>
              <input
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-moss focus:ring-2"
                value={payload.nickname}
                placeholder="например, Саша"
                onChange={(e) =>
                  persist({ ...payload, nickname: e.target.value })
                }
              />
            </label>

            <div>
              <p className="text-xs uppercase tracking-wider text-moss">
                Неделя плана
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((week) => (
                  <button
                    key={week}
                    type="button"
                    onClick={() => persist({ ...payload, week })}
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
                Напоминание про ферритин (дата анализа)
              </span>
              <input
                type="date"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-moss focus:ring-2"
                value={payload.ferritinReminder}
                onChange={(e) =>
                  persist({ ...payload, ferritinReminder: e.target.value })
                }
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-moss">
                Заметки недели
              </span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-moss focus:ring-2"
                placeholder="Энергия, тяга к сладкому, что зашло из меню…"
                value={payload.notes}
                onChange={(e) =>
                  persist({ ...payload, notes: e.target.value })
                }
              />
            </label>
          </div>

          <div className="rounded-2xl bg-pine p-5 text-sand sm:p-6">
            <h3 className="font-display text-xl">Выбор блюд на неделю</h3>
            <p className="mt-1 text-sm text-sand/70">
              Нажми 1 или 2 — какой вариант из меню берёшь
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

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {payload.nickname
            ? `${payload.nickname}, ты на неделе ${payload.week} из 4. `
            : null}
          Хостинг: GitHub + Vercel / Netlify / Render (бесплатно). БД: Neon — по
          желанию. Пошагово — в README.
        </p>
      </div>
    </section>
  );
}
