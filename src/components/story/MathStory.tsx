"use client";

import { useRef } from "react";
import StoryGraph from "@/components/story/StoryGraph";
import { useActiveStep, useChapter } from "@/components/story/Story";
import { Badge } from "@/components/ui/badge";

// The maths part of the story: a big graph sticks to the top 60% of the
// screen, and the text scrolls up below it.
export default function MathStory({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  // A step is active once it reaches the middle of the text area: 80% down
  const active = useActiveStep(ref, 0.8);

  return (
    <section ref={ref}>
      {/* The graph. It has the page background, so the text disappears
          behind it when it scrolls up. The "after:" classes add a strip
          under it that fades from the background to see-through, so the text
          fades out instead of being cut off. */}
      <div className="sticky top-0 z-10 flex h-[60vh] items-start justify-center bg-background pt-8 pb-4 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-24 after:bg-linear-to-b after:from-background after:to-transparent">
        <StoryGraph step={active} />
      </div>

      {children}
    </section>
  );
}

// One block of text in the maths part. It fills the text area under the
// graph, so you read one at a time.
//   term: the heading, with the chapter next to it
export function MathStep({
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
    <div data-step={step} className="flex min-h-[40vh] flex-col justify-center gap-3 py-6">
      <div className="flex items-center gap-4">
        {term && <h2 className="text-4xl font-bold tracking-tight text-primary">{term}</h2>}
        {chapter && (
          <Badge variant="secondary" className="text-sm">
            Chapter {chapter.number} · {chapter.title}
          </Badge>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
