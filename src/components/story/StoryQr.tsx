import QrGrid from "@/components/QrGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STORY_LEVEL, STORY_TEXT } from "@/components/story/codes";
import { makeQrInfo, type ModuleKind } from "@/lib/qr";

// What the card shows for each step of the story. A step either highlights
// one kind of module, or colours every byte.
type StepView = {
  title: string;
  caption: string;
  highlight?: ModuleKind;
  bytes?: boolean;
};

const STEPS: Record<string, StepView> = {
  intro: { title: "Our example code", caption: `Scan it: it says “${STORY_TEXT}”` },
  modules: { title: "Modules", caption: "Every square is one module: black = 1, white = 0" },
  finders: {
    title: "Finder patterns",
    caption: "Three corners tell where the code is and which way is up",
    highlight: "finder",
  },
  timing: { title: "Timing lines", caption: "Alternating modules work like a ruler", highlight: "timing" },
  alignment: {
    title: "Alignment pattern",
    caption: "Helps when the code is bent or seen at an angle",
    highlight: "alignment",
  },
  format: { title: "Format information", caption: "Level and mask, stored twice", highlight: "format" },
  data: { title: "Data", caption: "Everything else holds bytes", highlight: "data" },
  bytes: { title: "Bytes", caption: "Each colour block is one byte: 8 modules", bytes: true },
};

const INFO = makeQrInfo(STORY_TEXT, STORY_LEVEL);

// The QR card next to the story. It shows the code for the step that's being
// read right now, with the part the text talks about highlighted.
export default function StoryQr({ step }: { step: string }) {
  const view = STEPS[step];
  const size = INFO.grid.length;
  // Fit the code into about 300px
  const cell = Math.floor(300 / size);

  // Highlighted modules keep their black/white pattern: black ones get the
  // full colour, white ones a light tint of it
  function cellClass(x: number, y: number) {
    const black = INFO.grid[y][x] === 1;
    if (view?.bytes && INFO.byte[y][x] >= 0) {
      const even = INFO.byte[y][x] % 2 === 0;
      if (even) return black ? "bg-primary" : "bg-primary/20";
      return black ? "bg-highlight" : "bg-highlight/25";
    }
    if (view?.highlight && INFO.kind[y][x] === view.highlight) {
      return black ? "bg-primary" : "bg-primary/20";
    }
    return undefined; // normal black or white
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{view?.title}</CardTitle>
        <CardDescription>
          “{STORY_TEXT}” · level {STORY_LEVEL} · {size}×{size} modules
          {view?.bytes && ` · ${INFO.bytes} bytes`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* Starts as an invisible placeholder: FlyingQr.tsx draws the code on
            top of it until it lands */}
        <div data-qr-to className="invisible">
          <QrGrid qr={INFO.grid} cell={cell} cellClass={cellClass} />
        </div>
        <p className="text-center text-sm text-muted-foreground">{view?.caption}</p>
      </CardContent>
    </Card>
  );
}
