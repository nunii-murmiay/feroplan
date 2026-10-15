import {
  dessertSwaps,
  ironFoods,
  principles,
  shoppingStaples,
} from "@/data/nutrition";
import { fourWeekArc, softRules } from "@/data/habits";

export function PrinciplesSection() {
  return (
    <section id="principles" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-berry">
          01 · Питание
        </p>
        <h2 className="mt-3 font-display text-3xl text-pine sm:text-4xl">
          Принципы при низком ферритине и студенческом бюджете
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Это не жёсткая диета. Это каркас, который держит энергию на учёбе и
          помогает ферритину расти — вместе с врачом и анализами.
        </p>
      </header>

      <div className="mt-10 space-y-8">
        {principles.map((item, index) => (
          <article key={item.title} className="grid gap-3 border-t border-border/80 pt-8 sm:grid-cols-[140px_1fr]">
            <p className="font-display text-4xl text-moss/40">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-pine p-6 text-sand sm:p-8">
          <h3 className="font-display text-2xl">Железная шпаргалка</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-sand/60">Гемовое</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {ironFoods.heme.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-sand/60">Растительное</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {ironFoods.plant.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-sand/60">Усилители</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {ironFoods.boosters.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-sand/60">Отложить на 1–1,5 ч</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {ironFoods.blockers.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-sand/80 p-6 sm:p-8">
          <h3 className="font-display text-2xl text-pine">Корзина на неделю</h3>
          <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-ink/80">
            {shoppingStaples.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-moss">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl text-pine">Сладкое: замены, а не запреты</h3>
        <ul className="mt-6 divide-y divide-border/70">
          {dessertSwaps.map((item) => (
            <li
              key={item.craving}
              className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-6"
            >
              <p className="font-medium text-ink">{item.craving}</p>
              <p className="text-muted-foreground">{item.swap}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl text-pine">Дуга на 4 недели</h3>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {fourWeekArc.map((week) => (
            <li key={week.week} className="rounded-xl border border-border/80 bg-card/70 p-5">
              <p className="text-xs uppercase tracking-wider text-berry">
                Неделя {week.week}
              </p>
              <p className="mt-1 font-display text-xl text-pine">{week.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {week.focus}
              </p>
            </li>
          ))}
        </ol>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {softRules.map((rule) => (
            <li key={rule}>· {rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
