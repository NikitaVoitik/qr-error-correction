import QrGrid from "@/components/QrGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STORY_LEVEL, STORY_TEXT } from "@/components/story/codes";
import { makeQrInfo, type ModuleKind } from "@/lib/qr";

// What the card shows for each step of the story. A step can highlight one
// kind of module, or colour parts of the data (ranges of bits, see below).
type StepView = {
  title: string;
  caption: string;
  highlight?: ModuleKind;
  parts?: Part[];
  unmasked?: boolean; // show the code with the mask flipped back
};

// Bits from..to (not including "to") of the data, in reading order
type Part = [from: number, to: number];

const INFO = makeQrInfo(STORY_TEXT, STORY_LEVEL);

// Where everything is in the data of our code, in bits:
const LETTERS = STORY_TEXT.length;
const MESSAGE_END = 12 + LETTERS * 8; // after the 4-bit mode and 8-bit length
const DATA_BYTES = 16; // how many bytes a version 2 code at level H keeps for data

// Every block of 8 bits from byte "from" to byte "to"
function bytesBetween(from: number, to: number): Part[] {
  return Array.from({ length: to - from }, (_, i) => [(from + i) * 8, (from + i + 1) * 8]);
}

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
  bytes: { title: "Bytes", caption: "Each colour block is one byte: 8 modules", parts: bytesBetween(0, INFO.bytes) },
  unmask: { title: "Mask removed", caption: "Data modules flipped back: these are the real bits", unmasked: true },
  mode: { title: "Mode", caption: "0100 → the message is text", unmasked: true, parts: [[0, 4]] },
  length: { title: "Length", caption: "00001010 → 10 characters", unmasked: true, parts: [[4, 12]] },
  letter: { title: "First character", caption: "01001000 → 72 → “H”", unmasked: true, parts: [[12, 20]] },
  letters: {
    title: "Characters",
    caption: `One colour block per character: ${STORY_TEXT.split("").join(" ")}`,
    unmasked: true,
    parts: Array.from({ length: LETTERS }, (_, i) => [12 + i * 8, 20 + i * 8]),
  },
  filler: {
    title: "End and filler",
    caption: "0000 = the end, then 11101100 00010001 repeated",
    unmasked: true,
    parts: [[MESSAGE_END, MESSAGE_END + 4], ...bytesBetween(Math.ceil((MESSAGE_END + 4) / 8), DATA_BYTES)],
  },
  backup: {
    title: "Backup bytes",
    caption: `${INFO.bytes - DATA_BYTES} bytes to repair the other ${DATA_BYTES}`,
    unmasked: true,
    parts: [[DATA_BYTES * 8, INFO.bytes * 8]],
  },
};

// The QR card next to the story. It shows the code for the step that's being
// read right now, with the part the text talks about highlighted.
export default function StoryQr({ step }: { step: string }) {
  const view = STEPS[step];
  const size = INFO.grid.length;
  // Fit the code into about 300px
  const cell = Math.floor(300 / size);

  const qr = view?.unmasked ? INFO.unmasked : INFO.grid;

  // Highlighted modules keep their black/white pattern: black ones get the
  // full colour, white ones a light tint of it. Parts take turns between two
  // colours, so you can tell where one ends and the next begins.
  function cellClass(x: number, y: number) {
    const black = qr[y][x] === 1;
    const bit = INFO.bit[y][x];
    const part = view?.parts?.findIndex(([from, to]) => bit >= from && bit < to) ?? -1;
    if (part >= 0) {
      if (part % 2 === 0) return black ? "bg-primary" : "bg-primary/20";
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
          {view?.unmasked && " · mask removed"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* Starts as an invisible placeholder: FlyingQr.tsx draws the code on
            top of it until it lands */}
        <div data-qr-to className="invisible">
          <QrGrid qr={qr} cell={cell} cellClass={cellClass} />
        </div>
        <p className="text-center text-sm text-muted-foreground">{view?.caption}</p>
      </CardContent>
    </Card>
  );
}
