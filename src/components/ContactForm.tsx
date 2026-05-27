"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      form.reset();
      setState("success");
      setMessage("Danke, Ihre Anfrage wurde vorbereitet. Wir melden uns zeitnah.");
      return;
    }

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setState("error");
    setMessage(payload?.error ?? "Die Anfrage konnte gerade nicht gesendet werden.");
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
        disabled={state === "loading"}
        className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send aria-hidden size={18} />
        {state === "loading" ? "Wird gesendet" : "Anfrage senden"}
      </button>

      {message ? (
        <p
          role="status"
          className={`text-sm font-semibold ${state === "error" ? "text-red-700" : "text-primary"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
