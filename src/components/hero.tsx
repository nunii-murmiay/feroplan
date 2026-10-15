export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden leaf-pattern border-b border-border/60"
    >
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16 lg:py-28">
        <div>
          <p className="animate-fade-up font-display text-4xl leading-none text-pine sm:text-6xl md:text-7xl">
            Ферроплан
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
            4 недели мягкой заботы о энергии, железе и настроении
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Для студентки с ограниченным бюджетом, низким ферритином и живой
            тягой к сладкому — без запретов, монодиет и чувства вины.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#principles"
              className="inline-flex items-center justify-center rounded-md bg-pine px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-moss"
            >
              Начать с принципов
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-md border border-pine/20 bg-sand/60 px-5 py-2.5 text-sm font-medium text-pine transition hover:bg-sand"
            >
              Открыть меню
            </a>
            <a
              href="#progress"
              className="inline-flex items-center justify-center rounded-md border border-pine/20 bg-transparent px-5 py-2.5 text-sm font-medium text-pine transition hover:bg-sand/50"
            >
              Мой прогресс
            </a>
          </div>
        </div>

        <aside className="animate-fade-up-delay relative min-h-[220px] overflow-hidden rounded-2xl bg-pine text-sand shadow-[0_20px_60px_-30px_rgba(28,61,50,0.55)] sm:min-h-[280px]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(243,235,224,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(156,61,74,0.35), transparent 45%), linear-gradient(160deg, #1c3d32 0%, #2a5444 50%, #163028 100%)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-sand/70">
              Твой фокус
            </p>
            <ul className="mt-8 space-y-3 font-display text-xl leading-snug sm:text-2xl">
              <li>Повышать ферритин едой</li>
              <li>Двигаться без скуки</li>
              <li>Дружить со сладким, а не воевать</li>
            </ul>
            <p className="mt-10 text-sm text-sand/75">
              80% плана достаточно. Остальное — жизнь студентки.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
