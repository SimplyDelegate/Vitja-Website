"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { services } from "@/lib/content";

export function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleServices = useMemo(() => {
    return [0, 1, 2].map((offset) => services[(activeIndex + offset) % services.length]);
  }, [activeIndex]);

  function shift(direction: "previous" | "next") {
    setActiveIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? services.length - 1 : current - 1;
      }

      return (current + 1) % services.length;
    });
  }

  return (
    <div className="mt-10">
      <div className="grid gap-5 md:grid-cols-3">
        {visibleServices.map((service) => (
          <article key={service.title} className="border border-primary/10 bg-white p-6 shadow-soft">
            <div className="mb-8 grid h-12 w-12 place-items-center bg-accent text-white">
              <service.icon aria-hidden size={24} />
            </div>
            <h3 className="font-headline text-3xl font-semibold leading-none text-primary">
              {service.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-textSecondary">{service.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-textSecondary">
          {activeIndex + 1} / {services.length}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => shift("previous")}
            aria-label="Vorherige Leistungen anzeigen"
            className="focus-ring grid h-12 w-12 place-items-center border border-primary/15 bg-white text-primary transition hover:border-accent hover:text-accent"
          >
            <ArrowLeft aria-hidden size={20} />
          </button>
          <button
            type="button"
            onClick={() => shift("next")}
            aria-label="Naechste Leistungen anzeigen"
            className="focus-ring grid h-12 w-12 place-items-center bg-primary text-white transition hover:bg-accent"
          >
            <ArrowRight aria-hidden size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
