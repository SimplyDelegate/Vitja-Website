import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklaerung von ${siteConfig.name}.`
};

const sections = [
  {
    title: "1. Verantwortlicher",
    body: `${siteConfig.name}, ${siteConfig.address}, E-Mail: ${siteConfig.email}. Die vollstaendigen Unternehmensdaten muessen vor Veroeffentlichung ergaenzt werden.`
  },
  {
    title: "2. Hosting und Server-Logs",
    body: "Beim Besuch dieser Website werden technisch erforderliche Zugriffsdaten verarbeitet, zum Beispiel IP-Adresse, Zeitpunkt des Abrufs, Browserinformationen und angefragte Seiten. Die Verarbeitung erfolgt zur sicheren Bereitstellung der Website."
  },
  {
    title: "3. Kontaktformular",
    body: "Wenn Sie das Kontaktformular nutzen, verarbeiten wir die von Ihnen eingegebenen Daten zur Bearbeitung Ihrer Anfrage. Ohne konfigurierten E-Mail-Dienst wird die Anfrage in der lokalen Entwicklungsumgebung nicht extern versendet."
  },
  {
    title: "4. Cookies und Tracking",
    body: "Diese Umsetzung setzt keine Analyse- oder Marketing-Cookies ein. Sollten spaeter entsprechende Dienste ergaenzt werden, muss diese Erklaerung angepasst werden."
  },
  {
    title: "5. Ihre Rechte",
    body: "Sie haben nach Massgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung, Datenuebertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehoerde."
  }
];

export default function DatenschutzPage() {
  return (
    <main className="bg-bgLight pb-20 pt-32">
      <article className="section-shell max-w-3xl bg-white p-6 shadow-soft sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Rechtliches
        </p>
        <h1 className="font-headline text-5xl font-semibold leading-none text-primary">
          Datenschutzerklaerung
        </h1>
        <p className="mt-5 text-sm text-textSecondary">Stand: 25. Mai 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-textSecondary">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-headline text-3xl font-semibold text-primary">
                {section.title}
              </h2>
              <p className="mt-3">{section.body}</p>
            </section>
          ))}

          <p className="border-l-4 border-accent bg-bgLight p-4">
            Hinweis: Diese Datenschutzerklaerung ist eine technische Arbeitsfassung und muss vor
            Veroeffentlichung mit den tatsaechlich eingesetzten Diensten abgeglichen werden.
          </p>
        </div>
      </article>
    </main>
  );
}
