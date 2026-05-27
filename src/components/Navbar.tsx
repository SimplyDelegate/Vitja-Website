"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, siteConfig } from "@/lib/content";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.2, 0.4, 0.6] }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bgDark/86 backdrop-blur-xl">
      <nav className="section-shell flex h-20 items-center justify-between text-white">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm">
          <span className="grid h-11 w-11 place-items-center bg-accent font-headline text-2xl font-bold text-white">
            V
          </span>
          <span className="font-headline text-3xl font-semibold uppercase leading-none">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-sm px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-white text-primary" : "text-white/76 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="#kontakt"
          className="focus-ring hidden rounded-sm bg-accent px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-orange-600 md:inline-flex"
        >
          Anfrage starten
        </Link>

        <button
          type="button"
          aria-label={isOpen ? "Menue schliessen" : "Menue oeffnen"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 text-white md:hidden"
        >
          {isOpen ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-bgDark md:hidden">
          <div className="section-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="focus-ring rounded-sm px-3 py-3 text-base font-semibold text-white/88 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
