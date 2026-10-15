import QrGrid from "@/components/QrGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { makeQr } from "@/lib/qr";

const MESSAGE = "Hello, QR!";
const LEVEL = "H";

type Props = {
  step: string; // the data-step of the block being read right now
  small?: boolean; // smaller version for phones
};

// The QR card next to the story. It gets the current step, so it can show
// something different for each block of text.
export default function StoryQr({ step, small = false }: Props) {
  const qr = makeQr(MESSAGE, LEVEL);

  const size = qr.length;
  // Fit the code into about 300px (200px on phones)
  const cell = Math.floor((small ? 200 : 300) / size);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{step}</CardTitle>
        <CardDescription>
          “{MESSAGE}” · level {LEVEL} · {size}×{size} modules
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <QrGrid qr={qr} cell={cell} />
      </CardContent>
    </Card>
  );
}
