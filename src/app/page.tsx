import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { PrinciplesSection } from "@/components/principles-section";
import { MenuSection } from "@/components/menu-section";
import { TrainingSection } from "@/components/training-section";
import { CravingsSection } from "@/components/cravings-section";
import { ProgressSection } from "@/components/progress-section";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <PrinciplesSection />
        <MenuSection />
        <TrainingSection />
        <CravingsSection />
        <ProgressSection />
      </main>
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display text-lg text-pine">Ферроплан</p>
          <p>
            Мягкий план на 4 недели · питание · движение · цикл · без осуждения
          </p>
        </div>
      </footer>
    </>
  );
}
