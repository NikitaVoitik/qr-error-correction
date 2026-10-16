"use client";

import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import QrGrid from "@/components/QrGrid";
import { Button } from "@/components/ui/button";
import { scanQr } from "@/lib/scan";

// true = this module is painted red (damaged)
function emptyDamage(qr: number[][]) {
  return qr.map((row) => row.map(() => false));
}

export default function QrPainter({ qr }: { qr: number[][] }) {
  const [damage, setDamage] = useState(() => emptyDamage(qr));
  const painting = useRef(false);

  const SIZE = qr.length;
  // Bigger codes get smaller cells so the whole code stays about 400px wide
  const CELL = Math.max(6, Math.min(16, Math.floor(400 / SIZE)));

  const damaged = damage.flat().filter(Boolean).length;
  const percent = ((damaged / (SIZE * SIZE)) * 100).toFixed(1);
  const scanned = scanQr(qr, damage);
  const readable = scanned !== null;

  // Turn a mouse/finger position into a cell and paint it red
  function paintAt(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL);
    const y = Math.floor((e.clientY - rect.top) / CELL);
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
    if (damage[y][x]) return;

    setDamage((prev) => {
      const next = prev.map((row) => [...row]);
      next[y][x] = true;
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {readable ? (
        <p className="rounded-md bg-success/10 px-3 py-2 font-semibold text-success">
          ✅ Still scannable: reads &ldquo;{scanned}&rdquo;
        </p>
      ) : (
        <p className="rounded-md bg-destructive/10 px-3 py-2 font-semibold text-destructive">
          ❌ Not scannable anymore
        </p>
      )}

      <QrGrid
        qr={qr}
        cell={CELL}
        cellClass={(x, y) => (damage[y][x] ? "bg-destructive" : undefined)}
        gridProps={{
          className: "cursor-crosshair touch-none select-none",
          onPointerDown: (e) => {
            painting.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            paintAt(e);
          },
          onPointerMove: (e) => painting.current && paintAt(e),
          onPointerUp: () => (painting.current = false),
        }}
      />

      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Red modules: {damaged} of {SIZE * SIZE} ({percent}%)
        </p>
        <Button variant="outline" size="sm" onClick={() => setDamage(emptyDamage(qr))}>
          <RotateCcw /> Reset
        </Button>
      </div>
    </div>
  );
}
