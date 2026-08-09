"use client";

import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { asset } from "@/lib/assets";
import { services } from "@/lib/content";

export function ServicesGrid() {
  const requestService = (value: string) => {
    window.dispatchEvent(new CustomEvent("tts:select-service", { detail: value }));
  };

  return (
    <div className="services-grid">
      {services.map((service) => (
        <article className="service-card reveal" key={service.id}>
          <div className={`service-card-media${service.image ? " has-image" : " is-empty"}`} aria-hidden={service.image ? undefined : true}>
            {service.image && (
              <Image
                className="service-card-image"
                src={asset(service.image.src)}
                alt={service.image.alt}
                fill
                sizes="(max-width: 820px) calc(100vw - 38px), (max-width: 1120px) 50vw, 33vw"
                style={{ objectPosition: service.image.focus }}
              />
            )}
          </div>
          <div className="service-card-body">
            <h3>{service.title}</h3>
            <p>{service.short}</p>
            <a href="#kontakt" className="service-request" onClick={() => requestService(service.requestValue)}>
              Zu dieser Leistung anfragen <ArrowDownRight aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
