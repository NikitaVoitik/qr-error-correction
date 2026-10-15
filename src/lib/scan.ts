import jsQR from "jsqr";

const PX = 4; // image pixels per module
const QUIET_ZONE = 4; // white border, in modules

// Draws the QR code into an image and tries to read it. Returns the decoded
// text, or null. Damaged (red) modules are drawn black, because that's how a
// phone camera sees red ink next to white paper.
export function scanQr(qr: number[][], damage: boolean[][]): string | null {
  const modules = qr.length + QUIET_ZONE * 2;
  const width = modules * PX;
  const pixels = new Uint8ClampedArray(width * width * 4).fill(255); // all white

  for (let y = 0; y < qr.length; y++) {
    for (let x = 0; x < qr.length; x++) {
      const black = damage[y][x] || qr[y][x] === 1;
      if (!black) continue; // white, already filled

      // Fill this module's PX x PX square of pixels
      for (let dy = 0; dy < PX; dy++) {
        for (let dx = 0; dx < PX; dx++) {
          const px = (x + QUIET_ZONE) * PX + dx;
          const py = (y + QUIET_ZONE) * PX + dy;
          const i = (py * width + px) * 4;
          pixels[i] = pixels[i + 1] = pixels[i + 2] = 0;
        }
      }
    }
  }

  const result = jsQR(pixels, width, width, { inversionAttempts: "dontInvert" });
  return result ? result.data : null;
}
