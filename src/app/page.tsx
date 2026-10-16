import CurveDemo from "@/components/CurveDemo";
import QrDemo from "@/components/QrDemo";
import ReadingProgress from "@/components/story/ReadingProgress";
import FlyingQr from "@/components/story/FlyingQr";
import MathStory, { MathStep } from "@/components/story/MathStory";
import StartScreen from "@/components/story/StartScreen";
import Story, { Bits, Chapter, Detail, Lead, StepBlock } from "@/components/story/Story";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
// - <MathStory> and <MathStep>: the same for the maths chapters, but with a
//   big graph on top and the text below (see StoryGraph.tsx)
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
              <Lead>So how do these bits spell “Hello, QR!”?</Lead>
            </StepBlock>
          </Chapter>

          <Chapter number={5} title="Reading the message">
            <StepBlock step="unmask" term="Unmasking">
              <Lead>First, the scanner flips the mask back.</Lead>
              <Detail>
                The format strips said which of the 8 masks was used. Undo it,
                and the data modules show the real bits of the message.
              </Detail>
            </StepBlock>
            <StepBlock step="mode" term="Mode">
              <Lead>The first 4 bits say what kind of message it is.</Lead>
              <Detail>
                <Bits>0100</Bits> means text. Codes with only digits use a
                different mode that packs them tighter.
              </Detail>
            </StepBlock>
            <StepBlock step="length" term="Length">
              <Lead>The next 8 bits say how long it is.</Lead>
              <Detail>
                <Bits>00001010</Bits> is 10 in binary, and “Hello, QR!” has 10
                characters.
              </Detail>
            </StepBlock>
            <StepBlock step="letter" term="Characters">
              <Lead>Then come the characters, 8 bits each.</Lead>
              <Detail>
                <Bits>01001000</Bits> is 72, and 72 is the number computers use
                for “H” (it’s called ASCII).
              </Detail>
            </StepBlock>
            <StepBlock step="letters">
              <Lead>Ten characters, ten blocks of 8.</Lead>
              <Detail>
                Read one after another, they spell “Hello, QR!”.
              </Detail>
            </StepBlock>
            <StepBlock step="filler" term="End and filler">
              <Lead>Then a stop sign, and filler.</Lead>
              <Detail>
                <Bits>0000</Bits> marks the end. The rest of the space for the
                message is filled with <Bits>11101100</Bits> and{" "}
                <Bits>00010001</Bits>, again and again. The scanner ignores it.
              </Detail>
            </StepBlock>
            <StepBlock step="backup" term="Backup bytes">
              <Lead>That’s 16 bytes for the message. The other 28 are backup.</Lead>
              <Detail>
                They’re calculated from the first 16, and they can rebuild them
                when part of the code is damaged. That’s why a scratched code
                still works.
              </Detail>
            </StepBlock>
            <StepBlock step="repair" term="Level H">
              <Lead>28 backups are enough to fix 14 wrong bytes.</Lead>
              <Detail>
                14 of the 44 bytes is about 30%: that’s what level H means.
                Lower levels use fewer backups and leave more room for the
                message.
              </Detail>
              <Lead>But how can 28 bytes rebuild ones they’ve never seen?</Lead>
            </StepBlock>
          </Chapter>
        </Story>

        <MathStory>
          <Chapter number={6} title="Backups from a line">
            <MathStep step="rs-points" term="Reed–Solomon">
              <Lead>The trick is called Reed–Solomon. Let’s try it on a tiny message: 3 and 5.</Lead>
              <Detail>
                Put the numbers on a graph, one per step along x: 3 at x = 1,
                5 at x = 2.
              </Detail>
              <Detail>
                (Real QR codes use special arithmetic where every result stays
                a whole byte, 0 to 255. But the idea is the same.)
              </Detail>
            </MathStep>
            <MathStep step="rs-line">
              <Lead>Draw the line through them and keep going.</Lead>
              <Detail>
                At x = 3 the line is at 7, at x = 4 it’s at 9. Those are the
                backups: we send 3, 5, 7, 9.
              </Detail>
            </MathStep>
            <MathStep step="rs-line-lost" term="Recovery">
              <Lead>Now lose any two of them.</Lead>
              <Detail>
                Say 3 and 7 got scratched off. 5 and 9 are still there, and two
                points are all you need to draw a line. It’s the same line, so
                3 and 7 are back.
              </Detail>
            </MathStep>
          </Chapter>

          <Chapter number={7} title="Curves">
            <MathStep step="rs-curve" term="More numbers">
              <Lead>Three numbers don’t fit on a line, so we use a curve.</Lead>
              <Detail>
                Take 72, 101, 108: “H”, “e”, “l”. Exactly one parabola goes
                through 3 points, and it gives the backups 93 and 56.
              </Detail>
              <Detail>
                It works for any length: 4 numbers need a curve with one more
                bend, and so on. Every extra point on the curve is one more
                backup.
              </Detail>
            </MathStep>
            <MathStep step="rs-curve-lost">
              <Lead>Again, any 3 of the 5 are enough.</Lead>
              <Detail>
                101 and 93 are gone. The parabola through 72, 108 and 56 is the
                same one, and it passes right through 101 and 93.
              </Detail>
            </MathStep>
            <MathStep step="lagrange" term="Lagrange interpolation">
              <Lead>How do you find the curve from 3 points? Build it from parts.</Lead>
              <Detail>
                Make one part per point: a curve that’s exactly that point’s
                value there, and 0 at the other two points. Add the three parts
                up, and the sum hits all three points.
              </Detail>
              <Detail>
                That’s Lagrange’s trick, and it works for any number of points.
              </Detail>
            </MathStep>
            <MathStep step="rs-wrong" term="Wrong numbers">
              <Lead>A scratch doesn’t always erase a number. Sometimes it changes it.</Lead>
              <Detail>
                Then the points don’t all fit one curve, and the scanner has to
                work out which one is wrong. That costs more: each wrong number
                uses up two backups instead of one.
              </Detail>
              <Detail>
                So with 2 backups, like “Hel”, you can rebuild 2 lost numbers or
                fix 1 wrong one. Our QR code has 28 backups: up to 28 lost
                bytes, 14 wrong ones, or a mix, like 10 wrong and 8 lost.
              </Detail>
            </MathStep>
          </Chapter>
        </MathStory>

        <Separator className="my-20" />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Playground: break the message</CardTitle>
            <CardDescription className="text-lg">
              Lose numbers, and see when the curve can still bring them back.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurveDemo />
          </CardContent>
        </Card>

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
