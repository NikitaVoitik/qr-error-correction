"use client";

import { useState } from "react";
import QrPainter from "@/components/QrPainter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="qr-text">Text</Label>
          <Input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-72"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Error correction level</Label>
          <Select items={LEVELS} value={level} onValueChange={(v) => v && setLevel(v as Level)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {qr ? (
        // key: a new code starts the painter over with no damage
        <QrPainter key={`${level}:${text}`} qr={qr} />
      ) : (
        <p className="text-destructive">{error}</p>
      )}
    </div>
  );
}
