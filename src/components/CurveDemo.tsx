"use client";

import { useState } from "react";
import { RotateCcw, Wand2 } from "lucide-react";
import CurveGraph from "@/components/CurveGraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { scan, type GraphState } from "@/lib/curve";

// A playground for Reed–Solomon with normal numbers: type a short word, pick
// how many backups, lose some numbers, then press Rebuild and watch them come
// back.
export default function CurveDemo() {
  const [text, setText] = useState("Hel");
  const [backups, setBackups] = useState(2);
  const [lost, setLost] = useState<number[]>([]); // the x of every lost number
  const [rebuilt, setRebuilt] = useState(false);

  // Every letter becomes its number, like in the QR code: H → 72
  const message = Array.from(text).map((c) => c.charCodeAt(0));
  const broken: GraphState = {
    message,
    backups,
    lost,
    hideCurve: lost.length > 0 && !rebuilt,
  };
  const { sent, fine, curve } = scan(broken);
  // Once it's rebuilt, the graph is just the whole message again
  const state = rebuilt && curve ? { message, backups } : broken;

  // Any change breaks the code again, and it has to be rebuilt
  function change(newLost: number[]) {
    setLost(newLost);
    setRebuilt(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="curve-text">Message (1 to 4 letters)</Label>
          <Input
            id="curve-text"
            value={text}
            maxLength={4}
            onChange={(e) => {
              setText(e.target.value);
              change([]);
            }}
            className="w-40 text-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Backups</Label>
          <ToggleGroup
            variant="outline"
            value={[String(backups)]}
            onValueChange={(value) => {
              if (!value[0]) return; // clicked the one that's already on
              setBackups(Number(value[0]));
              change([]);
            }}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <ToggleGroupItem key={n} value={String(n)} className="px-4 text-lg">
                {n}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {message.length === 0 ? (
        <p className="text-destructive">Type a few letters.</p>
      ) : (
        <>
          <div className="flex min-h-14 items-center gap-4 text-lg font-semibold">
            {lost.length === 0 ? (
              <p className="font-normal text-muted-foreground">Click some numbers below to lose them.</p>
            ) : !rebuilt ? (
              <>
                <p>
                  {lost.length} lost, {fine.length} left. A curve through {message.length} numbers needs{" "}
                  {message.length}.
                </p>
                <Button size="lg" onClick={() => setRebuilt(true)} className="text-lg">
                  <Wand2 /> Rebuild
                </Button>
              </>
            ) : curve ? (
              <p className="text-success">✓ Rebuilt: the lost numbers are back</p>
            ) : (
              <p className="text-destructive">✗ Too few left: all of these curves fit, which one is it?</p>
            )}
          </div>

          <CurveGraph state={state} animate className="h-[30rem]" />

          {/* Every number that was sent: click to lose it or bring it back */}
          <div className="flex flex-wrap items-center gap-2">
            {sent.map((p) => (
              <Button
                key={p.x}
                variant={lost.includes(p.x) ? "secondary" : "outline"}
                onClick={() => change(lost.includes(p.x) ? lost.filter((x) => x !== p.x) : [...lost, p.x])}
                className="text-base"
              >
                x={p.x}: {lost.includes(p.x) ? <span className="text-destructive">?</span> : p.y}
              </Button>
            ))}
            <Button variant="ghost" onClick={() => change([])}>
              <RotateCcw /> Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
