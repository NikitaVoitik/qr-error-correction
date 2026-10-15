import QrDemo from "@/components/QrDemo";
import ReadingProgress from "@/components/story/ReadingProgress";
import Story, { Chapter, StepBlock } from "@/components/story/Story";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// A scroll story with a QR code that sticks to the side.
//
// Building blocks (in src/components/story/):
// - <Story>: the two-column layout with the sticky QR card
// - <Chapter number title>: a chapter heading
// - <StepBlock step="any-name">: text that switches the QR card while it's on
//   screen. The card gets the step name (see StoryQr.tsx).
export default function Home() {
  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <header className="mb-16 max-w-2xl space-y-5">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Title</h1>
        </header>

        <Story>
          <StepBlock step="intro">{/* intro text */}</StepBlock>

          <Separator />

          <Chapter number={1} title="Chapter title">
            <StepBlock step="bytes">{/* chapter text */}</StepBlock>
          </Chapter>
        </Story>

        <Separator className="my-20" />

        <Card>
          <CardContent className="overflow-x-auto">
            <QrDemo />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
