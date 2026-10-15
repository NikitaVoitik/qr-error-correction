import QrDemo from "@/components/QrDemo";
import ReadingProgress from "@/components/story/ReadingProgress";
import FlyingQr from "@/components/story/FlyingQr";
import StartScreen from "@/components/story/StartScreen";
import Story, { Chapter, Detail, Lead, StepBlock } from "@/components/story/Story";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// A scroll story with a QR code that sticks to the side.
//
// Building blocks (in src/components/story/):
// - <StartScreen />: the title slide you see first
// - <FlyingQr />: moves the start QR into the story card as you scroll
// - <Story>: the two-column layout with the sticky QR card
// - <Chapter number title>: groups steps; its title shows above each step
// - <StepBlock step="any-name" term="Heading">: text that switches the QR card
//   while it's on screen. The card gets the step name (see StoryQr.tsx).
// - <Lead> and <Detail>: the big main sentence and the smaller grey lines
export default function Home() {
  return (
    <>
      <ReadingProgress />

      <StartScreen />
      <FlyingQr />

      <main className="mx-auto max-w-6xl px-6 py-24">
        <Story>
          <StepBlock step="intro">
            <Lead>Before we break a QR code, let’s see how one is built.</Lead>
            <Detail>
              Keep an eye on the code on the right: it highlights whatever
              we’re talking about.
            </Detail>
          </StepBlock>

          <Chapter number={1} title="It’s all squares">
            <StepBlock step="modules" term="Modules">
              <Lead>A QR code is a grid of squares. Each one is a bit.</Lead>
              <Detail>Black is 1, white is 0. Our code is 25 × 25 modules.</Detail>
              <Detail>
                There are 40 sizes, called versions: from 21 × 21 up to
                177 × 177. Not every module holds the message, though.
              </Detail>
            </StepBlock>
          </Chapter>

          <Chapter number={2} title="Helping the scanner">
            <StepBlock step="finders" term="Finder patterns">
              <Lead>Three big squares tell the camera: here is a QR code.</Lead>
              <Detail>
                Their stripes go black, white, black, white, black in the ratio{" "}
                <span className="whitespace-nowrap">1 : 1 : 3 : 1 : 1</span>,
                which looks the same from every direction.
              </Detail>
              <Detail>
                The corner without one is always the bottom right, so the
                scanner knows which way is up.
              </Detail>
            </StepBlock>
            <StepBlock step="timing" term="Timing lines">
              <Lead>Two dotted lines work like a ruler.</Lead>
              <Detail>
                They alternate black and white, so the scanner knows exactly
                where every row and column is.
              </Detail>
            </StepBlock>
            <StepBlock step="alignment" term="Alignment pattern">
              <Lead>A small square keeps bent codes readable.</Lead>
              <Detail>
                If the code is on something curved or photographed at an
                angle, it helps the scanner straighten it out. Codes from
                version 2 up have one or more.
              </Detail>
            </StepBlock>
          </Chapter>

          <Chapter number={3} title="Reading instructions">
            <StepBlock step="format" term="Format information">
              <Lead>Two strips say how to read the rest.</Lead>
              <Detail>
                They store the error correction level and the mask: a fixed
                pattern that flips some modules so the code never has big
                empty areas. The scanner flips them back.
              </Detail>
              <Detail>
                And they’re stored twice. If one copy gets damaged, the other
                still works. Remember that idea: it’s what today is about.
              </Detail>
            </StepBlock>
          </Chapter>

          <Chapter number={4} title="The message">
            <StepBlock step="data" term="Data">
              <Lead>Everything else is where the message lives.</Lead>
            </StepBlock>
            <StepBlock step="bytes" term="Bytes">
              <Lead>Data is read in bytes: groups of 8 modules.</Lead>
              <Detail>
                They zigzag from the bottom-right corner, up one column two
                modules wide, then down the next, around the helper patterns.
              </Detail>
              <Detail>
                First comes a short header (“text, 10 characters”), then the
                characters of “Hello, QR!”, 8 bits each.
              </Detail>
              <Lead>
                But our short message needs only a few of these bytes. So what
                are all the others for?
              </Lead>
            </StepBlock>
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
