"use client";

import { ArrowDownRight } from "lucide-react";
import { services } from "@/lib/content";
import { ServiceMedia } from "./ServiceMedia";

export function ServicesGrid() {
  const requestService = (value: string) => {
    window.dispatchEvent(new CustomEvent("tts:select-service", { detail: value }));
  };

  return (
    <div className="services-grid">
      {services.map((service) => (
        <article className="service-card reveal" key={service.id}>
          <ServiceMedia
            images={service.gallery ?? (service.image ? [service.image] : [])}
            serviceTitle={service.title}
          />
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
