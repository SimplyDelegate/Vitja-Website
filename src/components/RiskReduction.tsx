import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { processCommitments } from "@/lib/content";

export function RiskReduction() {
  return (
    <section className="section risk-section" aria-labelledby="risk-title">
      <div className="shell">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">Planbar zusammenarbeiten</p>
            <h2 id="risk-title">So reduzieren wir Projektrisiken.</h2>
          </div>
          <div className="risk-heading-copy">
            <p>Vertrauen entsteht nicht durch Superlative, sondern durch klare Verantwortlichkeiten, abgestimmte Freigaben und einen nachvollziehbaren Leistungsstand.</p>
            <Link className="text-link" href="#vorgehen">Projektablauf ansehen <ArrowDownRight aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="risk-grid">
          {processCommitments.map((item) => (
            <article className="risk-card reveal" key={item.number}>
              <div className="risk-card-head"><span>{item.number}</span><small>Kundenrisiko</small></div>
              <p className="risk-problem">{item.customerRisk}</p>
              <h3>{item.title}</h3>
              <p className="risk-commitment">{item.commitment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
