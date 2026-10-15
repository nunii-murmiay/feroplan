"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#principles", label: "Питание" },
  { href: "#menu", label: "Меню" },
  { href: "#training", label: "Тренировки" },
  { href: "#cravings", label: "Сладкое и ПМС" },
  { href: "#progress", label: "Мой прогресс" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="font-display text-lg text-pine sm:text-xl">
          Ферроплан
        </a>
        <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-pine"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
