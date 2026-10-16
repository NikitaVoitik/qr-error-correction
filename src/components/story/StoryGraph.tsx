"use client";

import CurveGraph from "@/components/CurveGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GraphState } from "@/lib/curve";

// Our two examples: 3 and 5 on a line, and “Hel” (72, 101, 108) on a parabola
const LINE = [3, 5];
const HEL = [72, 101, 108];

// Every step of the maths part is one graph state (see GraphState in
// lib/curve.ts), with a title and caption for the card
const STEPS: Record<string, { title: string; caption: string; state: GraphState }> = {
  "rs-points": {
    title: "Our message: 3 and 5",
    caption: "One number per x: 3 at x = 1, 5 at x = 2",
    state: { message: LINE, backupCount: 0, hideCurve: true },
  },
  "rs-line": {
    title: "A line through them",
    caption: "It keeps going: 7 and 9 are the backups",
    state: { message: LINE, backupCount: 2 },
  },
  "rs-line-lost": {
    title: "Two numbers lost",
    caption: "5 and 9 are enough to draw the same line again",
    state: { message: LINE, backupCount: 2, lost: [1, 3] },
  },
  "rs-curve": {
    title: "“Hel” on a parabola",
    caption: "72, 101, 108 are H, e, l. The curve gives backups 93 and 56",
    state: { message: HEL, backupCount: 2 },
  },
  "rs-curve-lost": {
    title: "Two numbers lost",
    caption: "Any 3 of the 5 points give the same parabola",
    state: { message: HEL, backupCount: 2, lost: [2, 4] },
  },
  lagrange: {
    title: "Lagrange: one part per point",
    caption: "Each part hits its own point and is 0 at the others. Their sum is the curve",
    state: { message: HEL, backupCount: 2, lost: [2, 4], parts: true },
  },
  "rs-wrong": {
    title: "Every number is on the curve",
    caption: "So a number that isn’t on it must be wrong",
    state: { message: HEL, backupCount: 2 },
  },
};

// The big graph card at the top of the maths part (see MathStory.tsx)
export default function StoryGraph({ step }: { step: string }) {
  const view = STEPS[step];
  if (!view) return null; // before the first step is picked

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{view.title}</CardTitle>
        <CardDescription className="text-lg">{view.caption}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <CurveGraph state={view.state} className="size-full" />
      </CardContent>
    </Card>
  );
}
