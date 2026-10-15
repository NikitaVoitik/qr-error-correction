"use client";

import { useEffect, useState } from "react";
import StoryQr from "@/components/story/StoryQr";
import { Badge } from "@/components/ui/badge";

// Two columns: chapters on the left, a QR card on the right that sticks while
// you scroll and shows whichever <StepBlock> is in the middle of the screen.
export default function Story({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("");

  // Watch every block with a data-step attribute. When one crosses the
  // middle of the screen, it becomes the active step.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).dataset.step ?? "");
          }
        }
      },
      // Shrink the "visible" area to a thin band across the middle
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-step]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
      {/* Left: the chapters */}
      <article className="max-w-2xl space-y-16 text-lg leading-relaxed">{children}</article>

      {/* Right: the QR card that sticks while you scroll (desktop only) */}
      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <StoryQr step={active} />
        </div>
      </aside>
    </div>
  );
}

// One block of text that controls the QR card. On phones the card is shown
// right under the text instead of sticking to the side.
export function StepBlock({ step, children }: { step: string; children?: React.ReactNode }) {
  // On desktop each block gets some height, so the card has time to show it
  return (
    <div data-step={step} className="space-y-5 lg:min-h-[60vh]">
      {children}
      <div className="pt-2 lg:hidden">
        <StoryQr step={step} small />
      </div>
    </div>
  );
}

// A chapter heading with a "Chapter N" badge
export function Chapter({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Badge variant="secondary">Chapter {number}</Badge>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}
