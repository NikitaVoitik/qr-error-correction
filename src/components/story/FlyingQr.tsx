"use client";

import { useEffect, useRef } from "react";
import { START_TEXT, STORY_LEVEL, STORY_TEXT } from "@/components/story/codes";
import { makeQr } from "@/lib/qr";

const QUIET_ZONE = 4; // white border, in modules (same as QrGrid)

// A number between 0 and 1 that looks random but is always the same for the
// same module, so the dissolve doesn't flicker
function noise(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// A QR code drawn as an SVG, so it can be any size and still look sharp.
// Every black module switches on (appear) or off at its own random moment
// as --t goes from 0 to 1, so two codes dissolve into each other.
function QrSvg({ qr, appear }: { qr: number[][]; appear: boolean }) {
  const size = qr.length + QUIET_ZONE * 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 size-full fill-black" shapeRendering="crispEdges">
      {qr.map((row, y) =>
        row.map((value, x) => {
          if (!value) return null;
          const at = noise(x, y).toFixed(3);
          const opacity = appear
            ? `clamp(0, (var(--t) - ${at}) * 1000, 1)`
            : `clamp(0, (${at} - var(--t)) * 1000, 1)`;
          return (
            <rect key={`${x}-${y}`} x={x + QUIET_ZONE} y={y + QUIET_ZONE} width={1} height={1} style={{ opacity }} />
          );
        }),
      )}
    </svg>
  );
}

// This is the QR code you see at the top and in the story card. The real ones ([data-qr-from] and [data-qr-to]) are invisible
// placeholders, and this one sits on top of them: while you scroll past the
// start screen it moves from the first to the second, shrinking and
// dissolving from the start code into the story code.
export default function FlyingQr() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      const flying = ref.current;
      const from = document.querySelector("[data-qr-from]");
      const to = document.querySelector("[data-qr-to]");
      if (!flying || !from || !to) return;

      // 0 at the top of the page, 1 after scrolling about one screen
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
      // Ease in and out, so it starts and stops gently
      const t = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;

      // Somewhere between the two placeholders, depending on t
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const mix = (start: number, end: number) => start + (end - start) * t;
      flying.style.left = `${mix(a.left, b.left)}px`;
      flying.style.top = `${mix(a.top, b.top)}px`;
      flying.style.width = `${mix(a.width, b.width)}px`;
      flying.style.height = `${mix(a.height, b.height)}px`;
      flying.style.setProperty("--t", String(t));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-40 overflow-hidden rounded-lg bg-white ring-1 ring-border"
    >
      <QrSvg qr={makeQr(START_TEXT, "H")} appear={false} />
      <QrSvg qr={makeQr(STORY_TEXT, STORY_LEVEL)} appear />
    </div>
  );
}
