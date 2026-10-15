"use client";

import { useState } from "react";
import {
  beginnerYoga,
  gymFullBody,
  homeWorkouts,
  weekSchedule,
} from "@/data/workouts";

const tabs = [
  { value: "week", label: "Неделя" },
  { value: "home", label: "Домашние" },
  { value: "gym", label: "Зал" },
  { value: "yoga", label: "Йога" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

export function TrainingSection() {
  const [tab, setTab] = useState<TabValue>("week");

  return (
    <section id="training" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
          03 · Движение
        </p>
        <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
          Недельный график: дом, зал и йога для новичков
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          3–4 домашних тренировки + 1 зал. Разные стили, чтобы не скучать.
          В ПМС и менструацию смело снижай интенсивность — это умнее, не слабее.
        </p>
      </header>

      <div className="mt-10">
        <div
          role="tablist"
          aria-label="Разделы тренировок"
          className="flex flex-wrap gap-1"
        >
          {tabs.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={tab === item.value}
              onClick={() => setTab(item.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                tab === item.value
                  ? "border-pine/20 bg-pine text-sand"
                  : "border-transparent bg-card/60 text-foreground hover:bg-sand/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8" role="tabpanel" key={tab}>
          {tab === "week" ? (
            <>
              <h3 className="mb-4 font-display text-xl text-pine">
                Расписание на неделю
              </h3>
              <ol className="space-y-0">
                {weekSchedule.map((day) => (
                  <li
                    key={day.day}
                    className="grid gap-2 border-t border-border/70 py-5 sm:grid-cols-[140px_1fr]"
                  >
                    <p className="font-medium text-pine">{day.day}</p>
                    <div>
                      <p className="font-display text-lg text-ink">{day.type}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {day.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          {tab === "home" ? (
            <div className="space-y-10">
              <h3 className="font-display text-xl text-pine">
                Домашние тренировки без инвентаря
              </h3>
              {homeWorkouts.map((workout) => (
                <article
                  key={workout.id}
                  className="rounded-2xl bg-sand/70 p-5 sm:p-7"
                >
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <h4 className="font-display text-2xl text-pine">
                      {workout.title}
                    </h4>
                    <p className="text-sm text-moss">{workout.duration}</p>
                  </div>
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    {workout.vibe}
                  </p>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-berry">
                      Разминка
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-ink/80">
                      {workout.warmup.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>

                  {workout.blocks.map((block) => (
                    <div key={block.title} className="mt-5">
                      <p className="text-xs uppercase tracking-wider text-berry">
                        {block.title}
                      </p>
                      <ul className="mt-3 space-y-3">
                        {block.items.map((ex) => (
                          <li key={ex.name}>
                            <p className="font-medium text-ink">{ex.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ex.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {workout.finisher ? (
                    <p className="mt-5 text-sm text-pine">
                      Финиш: {workout.finisher}
                    </p>
                  ) : null}

                  <div className="mt-5 border-t border-pine/10 pt-4">
                    <p className="text-xs uppercase tracking-wider text-berry">
                      Йога-заминка
                    </p>
                    <ul className="mt-2 space-y-2">
                      {workout.yogaCooldown.map((ex) => (
                        <li key={ex.name} className="text-sm">
                          <span className="font-medium text-ink">{ex.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            — {ex.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {tab === "gym" ? (
            <article className="rounded-2xl bg-pine p-6 text-sand sm:p-8">
              <h3 className="font-display text-2xl">{gymFullBody.title}</h3>
              <p className="mt-2 text-sm text-sand/70">{gymFullBody.duration}</p>
              <p className="mt-4 leading-relaxed text-sand/90">
                {gymFullBody.principle}
              </p>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-sand/60">
                  Разминка
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {gymFullBody.warmup.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>

              <ol className="mt-6 space-y-3">
                {gymFullBody.exercises.map((ex, i) => (
                  <li
                    key={ex.name}
                    className="flex gap-3 border-t border-sand/15 pt-3"
                  >
                    <span className="font-display text-xl text-sand/40">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-sm text-sand/70">{ex.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 text-sm text-sand/80">
                Заминка: {gymFullBody.cooldown}
              </p>
              <p className="mt-3 text-sm text-sand/70">{gymFullBody.ifTired}</p>
            </article>
          ) : null}

          {tab === "yoga" ? (
            <>
              <h3 className="mb-2 font-display text-xl text-pine">
                Йога для новичков
              </h3>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Без опыта достаточно 10–15 минут. Дыши носом, не тяни через боль.
                Можно повторять в дни отдыха или как заминку после любой
                тренировки.
              </p>
              <ul className="space-y-5">
                {beginnerYoga.map((asana) => (
                  <li
                    key={asana.name}
                    className="grid gap-2 border-t border-border/70 pt-5 sm:grid-cols-[1fr_1.2fr]"
                  >
                    <div>
                      <p className="font-display text-xl text-pine">
                        {asana.name}
                      </p>
                      <p className="mt-1 text-sm text-berry">{asana.why}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {asana.how}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
