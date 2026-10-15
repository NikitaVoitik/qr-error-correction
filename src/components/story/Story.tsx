"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
    <div className="grid grid-cols-[minmax(0,1fr)_400px] gap-16">
      {/* Left: the chapters */}
      <article className="max-w-2xl">{children}</article>

      {/* Right: the QR card that sticks in the middle of the screen while you
          scroll */}
      <aside>
        <div className="sticky top-0 flex h-screen items-center">
          <StoryQr step={active} />
        </div>
      </aside>
    </div>
  );
}

// The chapter a StepBlock is in, so it can show "Chapter 2 · Title" above
// its text
const ChapterContext = createContext<{ number: number; title: string } | null>(null);

// One block of text that controls the QR card. Each block is most of a
// screen tall, with its text in the middle, next to the card.
//   term: the big heading, coloured like the highlight on the QR code
export function StepBlock({
  step,
  term,
  children,
}: {
  step: string;
  term?: string;
  children?: React.ReactNode;
}) {
  const chapter = useContext(ChapterContext);
  return (
    <div data-step={step} className="flex min-h-[80vh] flex-col justify-center gap-6">
      {chapter && (
        <Badge variant="secondary" className="text-sm">
          Chapter {chapter.number} · {chapter.title}
        </Badge>
      )}
      {term && <h2 className="text-5xl font-bold tracking-tight text-primary">{term}</h2>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// The main sentence of a step: big and dark
export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-3xl leading-snug font-medium">{children}</p>;
}

// Extra detail under the lead: smaller and grey
export function Detail({ children }: { children: React.ReactNode }) {
  return <p className="text-xl leading-relaxed text-muted-foreground">{children}</p>;
}

// Groups StepBlocks into a chapter. The title shows above each of its steps.
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
    <ChapterContext.Provider value={{ number, title }}>
      <section>{children}</section>
    </ChapterContext.Provider>
  );
}
