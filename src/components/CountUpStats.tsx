"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";

export function CountUpStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [values, setValues] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!ref.current || hasRun) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasRun(true);

        const startedAt = performance.now();
        const duration = 1100;

        function tick(now: number) {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValues(stats.map((stat) => Math.round(stat.value * eased)));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasRun]);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={stat.label} className="border border-primary/10 bg-white p-5">
          <p className="font-headline text-5xl font-semibold leading-none text-accent">
            {values[index]}
            {stat.suffix}
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-textSecondary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
