"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/content";

type FormState = "idle" | "success";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  // Die Seite liegt statisch auf GitHub Pages, es gibt kein Backend.
  // Der Submit oeffnet daher das Mailprogramm mit vorausgefuellter Nachricht.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const text = String(data.get("message") ?? "").trim();

    const subject = `Anfrage von ${name}`;
    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      company ? `Unternehmen: ${company}` : null,
      "",
      text
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setState("success");
    setMessage(
      `Ihr E-Mail-Programm wurde mit der Anfrage geoeffnet. Falls nichts passiert, schreiben Sie bitte direkt an ${siteConfig.email}.`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-primary/10 bg-white p-5 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-primary">
          Name
          <input
            required
            name="name"
            autoComplete="name"
            className="focus-ring min-h-12 border border-primary/15 bg-bgLight px-4 font-normal text-primary"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary">
          E-Mail
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="focus-ring min-h-12 border border-primary/15 bg-bgLight px-4 font-normal text-primary"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-primary">
        Unternehmen
        <input
          name="company"
          autoComplete="organization"
          className="focus-ring min-h-12 border border-primary/15 bg-bgLight px-4 font-normal text-primary"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-primary">
        Nachricht
        <textarea
          required
          name="message"
          rows={5}
          className="focus-ring resize-y border border-primary/15 bg-bgLight px-4 py-3 font-normal text-primary"
        />
      </label>

      <button
        type="submit"
        className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-5 text-sm font-bold text-white transition hover:bg-orange-600"
      >
        <Send aria-hidden size={18} />
        Anfrage per E-Mail senden
      </button>

      {state === "success" && message ? (
        <p role="status" className="text-sm font-semibold text-primary">
          {message}
        </p>
      ) : null}
    </form>
  );
}
