import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum von ${siteConfig.name}.`
};

export default function ImpressumPage() {
  return (
    <main className="bg-bgLight pb-20 pt-32">
      <article className="section-shell max-w-3xl bg-white p-6 shadow-soft sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Rechtliches
        </p>
        <h1 className="font-headline text-5xl font-semibold leading-none text-primary">
          Impressum
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-7 text-textSecondary">
          <section>
            <h2 className="font-headline text-3xl font-semibold text-primary">
              Angaben gemaess § 5 DDG
            </h2>
            <p className="mt-3">
              {siteConfig.name}
              <br />
              Rechtsform / Inhaber bitte ergaenzen
              <br />
              {siteConfig.address}
            </p>
          </section>

          <section>
            <h2 className="font-headline text-3xl font-semibold text-primary">Kontakt</h2>
            <p className="mt-3">
              Telefon: {siteConfig.phone}
              <br />
              E-Mail: {siteConfig.email}
            </p>
          </section>

          <section>
            <h2 className="font-headline text-3xl font-semibold text-primary">
              Register und Umsatzsteuer
            </h2>
            <p className="mt-3">
              Registereintrag, Registernummer und Umsatzsteuer-ID bitte ergaenzen, sofern vorhanden
              oder erforderlich.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-3xl font-semibold text-primary">
              Verantwortlich fuer den Inhalt
            </h2>
            <p className="mt-3">
              Verantwortliche Person nach § 18 Abs. 2 MStV bitte ergaenzen.
            </p>
          </section>

          <p className="border-l-4 border-accent bg-bgLight p-4">
            Hinweis: Diese Seite enthaelt Platzhalter, weil die vollstaendigen
            Unternehmensangaben im bereitgestellten Plan nicht enthalten waren.
          </p>
        </div>
      </article>
    </main>
  );
}
