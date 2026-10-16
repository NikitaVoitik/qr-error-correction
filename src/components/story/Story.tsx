"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import StoryQr from "@/components/story/StoryQr";
import { Badge } from "@/components/ui/badge";

// Which step is being read right now, out of the [data-step] blocks inside
// `ref`: the last one whose top has scrolled above a line across the screen.
// `line` is how far down the screen that is, e.g. 0.5 for the middle.
export function useActiveStep(ref: React.RefObject<HTMLElement | null>, line: number) {
  const [active, setActive] = useState("");

  useEffect(() => {
    function update() {
      const steps = ref.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [];
      let current = steps[0]?.dataset.step ?? ""; // before any step gets there
      for (const step of steps) {
        if (step.getBoundingClientRect().top < window.innerHeight * line) {
          current = step.dataset.step ?? "";
        }
      }
      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, line]);

  return active;
}

// Two columns: chapters on the left, a QR card on the right that sticks while
// you scroll and shows whichever <StepBlock> is in the middle of the screen.
export default function Story({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveStep(ref, 0.5);

  return (
    <div ref={ref} className="grid grid-cols-[minmax(0,1fr)_400px] gap-16">
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
export function useChapter() {
  return useContext(ChapterContext);
}

export function StepBlock({
  step,
  term,
  children,
}: {
  step: string;
  term?: string;
  children?: React.ReactNode;
}) {
  const chapter = useChapter();
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

// Ones and zeros inside the text, e.g. <Bits>0100</Bits>
export function Bits({ children }: { children: React.ReactNode }) {
  return <code className="font-mono font-semibold text-foreground">{children}</code>;
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
