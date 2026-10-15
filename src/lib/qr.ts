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
  const { size, data } = QRCode.create(text, { errorCorrectionLevel: level }).modules;

  const grid: number[][] = [];
  for (let y = 0; y < size; y++) {
    grid.push(Array.from(data.slice(y * size, (y + 1) * size)));
  }
  return grid;
}
