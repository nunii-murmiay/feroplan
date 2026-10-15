"use client";

import { useState } from "react";
import { portionGuide, weeklyMenu } from "@/data/nutrition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MenuSection() {
  const [day, setDay] = useState(weeklyMenu[0].short);

  return (
    <section
      id="menu"
      className="border-y border-border/60 bg-mist/40 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
            02 · Меню-ротация
          </p>
          <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
            Неделя с примерной граммовкой
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            На каждый приём — 2 варианта с граммами. Крупы указаны в сухом виде
            (удобно взвесить до варки). Диапазон ≈ ±10–15 г — подстрой под голод
            и учёбу, не гонись за идеальной точностью каждый день.
          </p>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-pine/10 bg-card/70">
          <div className="border-b border-pine/10 bg-sand/50 px-4 py-3 sm:px-5">
            <h3 className="font-display text-lg text-pine">
              Шпаргалка порций
            </h3>
            <p className="text-sm text-muted-foreground">
              Быстрые ориентиры, если весов нет под рукой
            </p>
          </div>
          <ul className="divide-y divide-border/60">
            {portionGuide.map((row) => (
              <li
                key={row.item}
                className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4 sm:px-5"
              >
                <span className="font-medium text-ink">{row.item}</span>
                <span className="text-muted-foreground">{row.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <Tabs value={day} onValueChange={setDay} className="mt-10">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            {weeklyMenu.map((item) => (
              <TabsTrigger
                key={item.short}
                value={item.short}
                className="rounded-full border border-transparent bg-card/50 px-3 py-1.5 text-sm data-[state=active]:border-pine/20 data-[state=active]:bg-pine data-[state=active]:text-sand"
              >
                {item.short}
              </TabsTrigger>
            ))}
          </TabsList>

          {weeklyMenu.map((item) => (
            <TabsContent key={item.short} value={item.short} className="mt-8">
              <div className="mb-6">
                <h3 className="font-display text-2xl text-pine">{item.day}</h3>
                <p className="mt-1 text-sm text-moss">Фокус: {item.focus}</p>
              </div>

              <div className="space-y-8">
                {item.meals.map((meal) => (
                  <article
                    key={meal.name}
                    className="border-t border-pine/10 pt-5"
                  >
                    <h4 className="font-display text-lg text-ink">{meal.name}</h4>
                    <div className="mt-4 space-y-5">
                      {meal.options.map((option, idx) => (
                        <div
                          key={option.title}
                          className="rounded-xl bg-background/50 p-4 sm:p-5"
                        >
                          <p className="flex items-start gap-3 font-medium text-ink">
                            <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sand text-xs font-medium text-pine">
                              {idx + 1}
                            </span>
                            <span>{option.title}</span>
                          </p>
                          <ul className="mt-3 space-y-1.5 pl-8 text-sm leading-relaxed text-muted-foreground">
                            {option.grams.map((line) => (
                              <li key={line} className="flex gap-2">
                                <span className="text-moss">·</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {meal.tip ? (
                      <p className="mt-3 text-sm text-berry/90">
                        Совет: {meal.tip}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Лайфхак на воскресенье: отмерь сразу 3 порции крупы по 65 г сухой,
          запеки 500–600 г бёдер, отвари 6 яиц. В будни только собираешь тарелку
          по граммам из списка — меньше импульсивных перекусов от голода.
        </p>
      </div>
    </section>
  );
}
