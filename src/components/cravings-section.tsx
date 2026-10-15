"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  cravingChecklist,
  cyclePhases,
  pmsPlate,
} from "@/data/habits";

export function CravingsSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <section
      id="cravings"
      className="border-t border-border/60 bg-sand/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
            04 · Сладкое и цикл
          </p>
          <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
            Гайд по тяге и ПМС без самокритики
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Тяга — сигнал, а не провал характера. Особенно в ПМС мозг просит
            быстрый дофамин и углеводы. Мы отвечаем заботой и планом, а не
            войной с собой.
          </p>
        </header>

        <div className="mt-10 rounded-2xl bg-card/80 p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl text-pine">
              Чек-лист при острой тяге
            </h3>
            <p className="text-sm text-moss">
              Пройдено: {doneCount} / {cravingChecklist.length}
            </p>
          </div>
          <ul className="mt-6 space-y-4">
            {cravingChecklist.map((item) => (
              <li
                key={item.id}
                className={`flex gap-3 rounded-xl border p-4 transition ${
                  checked[item.id]
                    ? "border-moss/30 bg-mist/60"
                    : "border-border/70 bg-background/40"
                }`}
              >
                <Checkbox
                  id={item.id}
                  checked={!!checked[item.id]}
                  onCheckedChange={() => toggle(item.id)}
                  className="mt-1"
                />
                <label htmlFor={item.id} className="cursor-pointer">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h3 className="font-display text-2xl text-pine">
            Питание и нагрузка по фазам цикла
          </h3>
          <div className="mt-6 space-y-6">
            {cyclePhases.map((phase) => (
              <article
                key={phase.phase}
                className="border-t border-border/80 pt-6"
              >
                <h4 className="font-display text-xl text-ink">{phase.phase}</h4>
                <p className="mt-1 text-sm text-berry">{phase.energy}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-moss">
                      Еда
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {phase.food}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-moss">
                      Тренировки
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {phase.training}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-2xl bg-pine p-6 text-sand sm:p-8">
          <h3 className="font-display text-2xl">Тарелка ПМС</h3>
          <p className="mt-2 text-sm text-sand/75">
            Когда тянет на сладкое сильнее обычного — сначала собери такую
            тарелку, потом реши про десерт.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm sm:text-base">
            {pmsPlate.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Важно: план поддерживает питание и привычки, но не заменяет врача.
          При низком ферритине обсуди анализы, возможные добавки железа и
          причины дефицита (в том числе менструальные потери) со специалистом.
        </p>
      </div>
    </section>
  );
}
