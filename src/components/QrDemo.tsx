"use client";

import { useState } from "react";
import QrPainter from "@/components/QrPainter";
import { LEVELS, makeQr, type Level } from "@/lib/qr";

export default function QrDemo() {
  const [text, setText] = useState("Hello, QR!");
  const [level, setLevel] = useState<Level>("H");

  // The library throws if the text is empty or too long to fit in a QR code
  let qr: number[][] | null = null;
  let error = "";
  if (text === "") {
    error = "Type some text to generate a QR code.";
  } else {
    try {
      qr = makeQr(text, level);
    } catch {
      error = "This text is too long for a QR code at this level.";
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted">Text</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-72 rounded border border-border px-3 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted">Error correction level</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="rounded border border-border px-3 py-1"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {qr ? (
        // key: a new code starts the painter over with no damage
        <QrPainter key={`${level}:${text}`} qr={qr} />
      ) : (
        <p className="text-damage">{error}</p>
      )}
    </div>
  );
}
