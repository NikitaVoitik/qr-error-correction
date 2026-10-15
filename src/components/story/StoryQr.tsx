import QrGrid from "@/components/QrGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STORY_LEVEL, STORY_TEXT } from "@/components/story/codes";
import { makeQr } from "@/lib/qr";

type Props = {
  step: string; // the data-step of the block being read right now
};

// The QR card next to the story. It gets the current step, so it can show
// something different for each block of text.
export default function StoryQr({ step }: Props) {
  const qr = makeQr(STORY_TEXT, STORY_LEVEL);

  const size = qr.length;
  // Fit the code into about 300px
  const cell = Math.floor(300 / size);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{step}</CardTitle>
        <CardDescription>
          “{STORY_TEXT}” · level {STORY_LEVEL} · {size}×{size} modules
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {/* An invisible placeholder: FlyingQr.tsx draws the code on top of it */}
        <div data-qr-to className="invisible">
          <QrGrid qr={qr} cell={cell} />
        </div>
      </CardContent>
    </Card>
  );
}
