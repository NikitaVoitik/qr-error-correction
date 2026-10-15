import QRCode from "qrcode";

// How much of the code can be damaged and still be recovered
export const LEVELS = [
  { value: "L", label: "L – Low (~7%)" },
  { value: "M", label: "M – Medium (~15%)" },
  { value: "Q", label: "Q – Quartile (~25%)" },
  { value: "H", label: "H – High (~30%)" },
] as const;

export type Level = (typeof LEVELS)[number]["value"];

// Generates a QR code as a 2D array: 1 = black, 0 = white.
export function makeQr(text: string, level: Level): number[][] {
  return makeQrInfo(text, level).grid;
}

// What a module is used for
export type ModuleKind =
  | "finder" // the three big corner squares (and the white edge around them)
  | "timing" // the dotted lines between the finders
  | "format" // the strips next to the finders: level and mask
  | "alignment" // the small square(s) in bigger codes
  | "data"; // everything else: the bytes

export type QrInfo = {
  grid: number[][]; // 1 = black, 0 = white
  kind: ModuleKind[][];
  byte: number[][]; // which byte a data module belongs to, or -1
  bytes: number; // how many bytes fit in the code
};

// Generates a QR code and works out what every module is used for.
export function makeQrInfo(text: string, level: Level): QrInfo {
  const { size, data, reservedBit } = QRCode.create(text, { errorCorrectionLevel: level }).modules;

  // The library marks every module that isn't data as "reserved". We tell
  // those apart by where they are.
  function kindOf(x: number, y: number): ModuleKind {
    if (!reservedBit[y * size + x]) return "data";
    const corner = (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
    if (corner) return "finder";
    if (x === 6 || y === 6) return "timing";
    if (x === 8 || y === 8) return "format";
    return "alignment"; // (codes of version 7+ also have version info, not used here)
  }

  const grid: number[][] = [];
  const kind: ModuleKind[][] = [];
  const byte: number[][] = [];
  for (let y = 0; y < size; y++) {
    grid.push(Array.from(data.slice(y * size, (y + 1) * size)));
    kind.push(Array.from({ length: size }, (_, x) => kindOf(x, y)));
    byte.push(Array(size).fill(-1));
  }

  // Every 8 data modules make a byte. A few leftover modules don't fit.
  const dataModules = kind.flat().filter((k) => k === "data").length;
  const bytes = Math.floor(dataModules / 8);

  // Bytes are placed in 2-module-wide columns, zigzagging up and down from
  // the bottom-right corner (the same order the qrcode library uses).
  let bit = 0;
  let up = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip the vertical timing line
    for (let i = 0; i < size; i++) {
      const y = up ? size - 1 - i : i;
      for (const x of [col, col - 1]) {
        if (kind[y][x] !== "data") continue;
        const b = Math.floor(bit / 8);
        if (b < bytes) byte[y][x] = b;
        bit++;
      }
    }
    up = !up;
  }

  return { grid, kind, byte, bytes };
}
