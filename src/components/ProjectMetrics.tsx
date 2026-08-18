"use client";

import { useEffect, useRef } from "react";
import type { FeaturedProjectMetric } from "@/lib/content";

type ProjectMetricsProps = {
  title: string;
  items: [FeaturedProjectMetric, FeaturedProjectMetric, FeaturedProjectMetric];
};

const numberFormatter = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

function formattedMetric(metric: FeaturedProjectMetric, value = metric.value) {
  return `${metric.prefix}${numberFormatter.format(value)}${metric.suffix}`;
}

export function ProjectMetrics({ title, items }: ProjectMetricsProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const values = Array.from(list.querySelectorAll<HTMLElement>("[data-count-value]"));
    let animationFrame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const startedAt = performance.now();
        const duration = 760;
        const stagger = 90;

        const render = (now: number) => {
          let complete = true;

          values.forEach((element, index) => {
            const target = Number(element.dataset.countValue);
            const elapsed = Math.max(0, now - startedAt - index * stagger);
            const progress = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            element.textContent = numberFormatter.format(current);
            if (progress < 1) complete = false;
          });

          if (!complete) animationFrame = window.requestAnimationFrame(render);
        };

        values.forEach((element) => {
          element.textContent = "0";
        });
        animationFrame = window.requestAnimationFrame(render);
      },
      { threshold: 0.35 }
    );

    observer.observe(list);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [items]);

  return (
    <ul className="featured-project-metrics" aria-label={`Kennzahlen zu ${title}`} ref={listRef}>
      {items.map((metric) => (
        <li key={metric.label}>
          <strong aria-label={formattedMetric(metric)}>
            {metric.prefix.trim() && <span className="featured-project-metric-affix" aria-hidden="true">{metric.prefix.trim()}</span>}
            <span
              aria-hidden="true"
              data-count-value={metric.value}
            >
              {numberFormatter.format(metric.value)}
            </span>
            {metric.suffix.trim() && <span className="featured-project-metric-affix" aria-hidden="true">{metric.suffix.trim()}</span>}
          </strong>
          <span>{metric.label}</span>
        </li>
      ))}
    </ul>
  );
}
