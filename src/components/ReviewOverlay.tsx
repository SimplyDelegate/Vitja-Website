"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Note = {
  id: number;
  x: number;
  y: number;
  text: string;
  context: string;
};

type ReviewFileHandle = {
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

const storageKeyForReview = (review: string) => review === "1" ? "vitja-mobile-review-notes" : `vitja-${review}-review-notes`;

function pageContext(target: EventTarget | null) {
  if (!(target instanceof Element)) return "";
  const element = target.closest("h1, h2, h3, p, a, button, li, input, textarea, label");
  return element?.textContent?.replace(/\s+/g, " ").trim().slice(0, 90) ?? "";
}

export function ReviewOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [storageKey, setStorageKey] = useState("");
  const [reviewName, setReviewName] = useState("mobile");
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<Omit<Note, "id" | "text"> | null>(null);
  const [openNote, setOpenNote] = useState<Note | null>(null);
  const [fileHandle, setFileHandle] = useState<ReviewFileHandle | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const review = new URLSearchParams(window.location.search).get("review");
    if (!review) return;
    const key = storageKeyForReview(review);
    setEnabled(true);
    setStorageKey(key);
    setReviewName(review === "1" ? "mobile" : review);
    try {
      setNotes(JSON.parse(window.localStorage.getItem(key) ?? "[]"));
    } catch {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [enabled, notes, storageKey]);

  useEffect(() => {
    if (!fileHandle) return;
    const save = async () => {
      try {
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify({ exportedAt: new Date().toISOString(), notes }, null, 2));
        await writable.close();
        setSaveStatus("Automatisch gespeichert");
      } catch {
        setSaveStatus("Speichern fehlgeschlagen");
      }
    };
    void save();
  }, [fileHandle, notes]);

  useEffect(() => {
    if (pending) inputRef.current?.focus();
  }, [pending]);

  useEffect(() => {
    if (!enabled) return;
    const handleClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("[data-review-controls]")) return;
      event.preventDefault();
      event.stopPropagation();
      setPending({ x: event.clientX, y: event.clientY + window.scrollY, context: pageContext(event.target) });
      setDraft("");
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled]);

  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pending || !draft.trim()) return;
    setNotes((current) => [...current, { id: Date.now(), ...pending, text: draft.trim() }]);
    setPending(null);
  };

  const removeNote = (id: number) => {
    setNotes((current) => current.filter((note) => note.id !== id));
    setOpenNote(null);
  };

  const chooseSaveFile = async () => {
    const picker = (window as Window & { showSaveFilePicker?: (options: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<ReviewFileHandle> }).showSaveFilePicker;
    if (!picker) {
      setSaveStatus("Bitte in Chrome öffnen");
      return;
    }
    try {
      setFileHandle(await picker({
        suggestedName: `vitja-${reviewName}-review-notizen.json`,
        types: [{ description: "JSON-Datei", accept: { "application/json": [".json"] } }]
      }));
    } catch {
      setSaveStatus("Kein Speicherort gewählt");
    }
  };

  if (!enabled) return null;

  return (
    <>
      <aside className="review-toolbar" data-review-controls aria-label="Review-Modus">
        <strong>Review-Modus</strong>
        <span>{notes.length} Notiz{notes.length === 1 ? "" : "en"}</span>
        <button type="button" onClick={chooseSaveFile}>Speicherort wählen</button>
        {saveStatus && <span className="review-save-status">{saveStatus}</span>}
        <button type="button" onClick={() => setNotes([])}>Alle löschen</button>
      </aside>

      {notes.map((note, index) => (
        <button
          className="review-pin"
          data-review-controls
          key={note.id}
          type="button"
          style={{ left: note.x, top: note.y }}
          aria-label={`Notiz ${index + 1}: ${note.text}`}
          title={note.text}
          onClick={() => setOpenNote(note)}
        >
          {index + 1}
        </button>
      ))}

      {openNote && (
        <aside className="review-note-view" data-review-controls aria-label="Gespeicherte Notiz">
          <p>{openNote.context || "Notiz"}</p>
          <strong>{openNote.text}</strong>
          <div>
            <button type="button" onClick={() => removeNote(openNote.id)}>Löschen</button>
            <button type="button" onClick={() => setOpenNote(null)}>Schließen</button>
          </div>
        </aside>
      )}

      {pending && (
        <form className="review-note-form" data-review-controls onSubmit={saveNote}>
          <p>{pending.context || "Neue Notiz"}</p>
          <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Textanpassung notieren …" aria-label="Notiz" rows={3} />
          <div>
            <button type="button" onClick={() => setPending(null)}>Abbrechen</button>
            <button type="submit">Notiz speichern</button>
          </div>
        </form>
      )}
    </>
  );
}
