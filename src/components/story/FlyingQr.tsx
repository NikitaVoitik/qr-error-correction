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

// This is the QR code you see at the top. The real ones ([data-qr-from] and
// [data-qr-to]) start out as invisible placeholders, and this one sits on top
// of them: while you scroll past the start screen it moves from the first to
// the second, shrinking and dissolving from the start code into the story
// code. When it lands, the real story code takes over.
export default function FlyingQr() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      const flying = ref.current;
      const from = document.querySelector("[data-qr-from]");
      const to = document.querySelector<HTMLElement>("[data-qr-to]");
      if (!flying || !from || !to) return;

      // 0 at the top of the page, 1 once the start screen has scrolled away.
      // Both codes move with the page until then, so going straight from one
      // to the other keeps it on screen.
      const startScreen = from.closest("section");
      if (!startScreen) return;
      const t = Math.min(window.scrollY / startScreen.offsetHeight, 1);

      // Somewhere between the two placeholders, depending on t
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const mix = (start: number, end: number) => start + (end - start) * t;
      flying.style.left = `${mix(a.left, b.left)}px`;
      flying.style.top = `${mix(a.top, b.top)}px`;
      flying.style.width = `${mix(a.width, b.width)}px`;
      flying.style.height = `${mix(a.height, b.height)}px`;
      flying.style.setProperty("--t", String(t));

      // Once it has landed, hide it and show the real story code underneath,
      // so the story card can highlight parts of it
      const landed = t >= 1;
      flying.style.visibility = landed ? "hidden" : "visible";
      to.style.visibility = landed ? "visible" : "hidden";
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
