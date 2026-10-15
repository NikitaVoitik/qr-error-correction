import { cn } from "@/lib/utils";

const QUIET_ZONE = 4; // white border scanners need, in modules

type Props = {
  qr: number[][];
  cell?: number; // px per module
  // Extra classes for one module, e.g. to highlight it. Return undefined to
  // draw it normally (black or white).
  cellClass?: (x: number, y: number) => string | undefined;
  gridProps?: React.HTMLAttributes<HTMLDivElement>;
};

// Draws a QR code from a 2D array. QR modules stay real black and white in
// every theme, because that's what a scanner needs.
export default function QrGrid({ qr, cell = 12, cellClass, gridProps }: Props) {
  const size = qr.length;
  return (
    <div
      className="w-fit rounded-lg bg-white ring-1 ring-border"
      style={{ padding: cell * QUIET_ZONE }}
    >
      <div
        {...gridProps}
        className={cn("grid", gridProps?.className)}
        style={{ gridTemplateColumns: `repeat(${size}, ${cell}px)` }}
      >
        {qr.map((row, y) =>
          row.map((value, x) => (
            <div
              key={`${x}-${y}`}
              className={cellClass?.(x, y) ?? (value ? "bg-black" : "bg-white")}
              style={{ width: cell, height: cell }}
            />
          )),
        )}
      </div>
    </div>
  );
}
