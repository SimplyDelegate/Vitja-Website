"use client";

import { ArrowDownRight, Plus } from "lucide-react";
import { services } from "@/lib/content";

export function ServicesGrid() {
  const requestService = (value: string) => {
    window.dispatchEvent(new CustomEvent("tts:select-service", { detail: value }));
  };

  return (
    <div className="services-grid">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <article className="service-card reveal" key={service.id}>
            <div className="service-card-top">
              <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" />
            </div>
            <h3>{service.title}</h3>
            <p>{service.short}</p>
            <details>
              <summary><Plus aria-hidden="true" /> Details zur Leistung</summary>
              <div className="service-detail-content">
                <p>{service.detail}</p>
                <div><strong>Auftragsklärung</strong><span>{service.scope}</span></div>
                <div><strong>Nachweise</strong><ul>{service.proofPoints.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Übergabe</strong><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            </details>
            <a href="#kontakt" className="service-request" onClick={() => requestService(service.requestValue)}>
              Zu dieser Leistung anfragen <ArrowDownRight aria-hidden="true" />
            </a>
          </article>
        );
      })}
    </div>
  );
}
