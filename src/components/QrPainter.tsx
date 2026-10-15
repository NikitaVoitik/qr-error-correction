"use client";

import { useRef, useState } from "react";
import { QR_CODE } from "@/lib/qr";
import { scanQr } from "@/lib/scan";

const SIZE = QR_CODE.length;
const CELL = 16; // px per module
const QUIET_ZONE = 4; // white border scanners need, in modules

// true = this module is painted red (damaged)
function emptyDamage() {
  return QR_CODE.map((row) => row.map(() => false));
}

export default function QrPainter() {
  const [damage, setDamage] = useState(emptyDamage);
  const painting = useRef(false);

  const damaged = damage.flat().filter(Boolean).length;
  const percent = ((damaged / (SIZE * SIZE)) * 100).toFixed(1);
  const scanned = scanQr(QR_CODE, damage);

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
    <div className="flex flex-col items-start gap-4">
      {scanned !== null ? (
        <p className="rounded bg-ok/10 px-3 py-2 font-bold text-ok">
          ✅ Still scannable: reads &ldquo;{scanned}&rdquo;
        </p>
      ) : (
        <p className="rounded bg-damage/10 px-3 py-2 font-bold text-damage">
          ❌ Not scannable anymore
        </p>
      )}

      <div className="border border-border bg-white" style={{ padding: CELL * QUIET_ZONE }}>
        <div
          className="grid cursor-crosshair touch-none select-none"
          style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)` }}
          onPointerDown={(e) => {
            painting.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            paintAt(e);
          }}
          onPointerMove={(e) => painting.current && paintAt(e)}
          onPointerUp={() => (painting.current = false)}
        >
          {QR_CODE.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={damage[y][x] ? "bg-damage" : cell ? "bg-black" : "bg-white"}
                style={{ width: CELL, height: CELL }}
              />
            )),
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-muted">
          Damaged modules: {damaged} of {SIZE * SIZE} ({percent}%)
        </p>
        <button
          onClick={() => setDamage(emptyDamage())}
          className="rounded border border-border bg-surface px-3 py-1"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
