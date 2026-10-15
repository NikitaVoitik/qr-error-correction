import { ChevronDown } from "lucide-react";
import QrGrid from "@/components/QrGrid";
import { Badge } from "@/components/ui/badge";
import { START_TEXT } from "@/components/story/codes";
import { makeQr } from "@/lib/qr";

// The first screen: a title slide that fills the whole window
export default function StartScreen() {
  const qr = makeQr(START_TEXT, "H");

  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-12 px-6 py-16">
      <div className="flex items-center gap-20">
        <div className="max-w-xl space-y-6">
          <Badge variant="secondary" className="text-sm">
            Today
          </Badge>
          <h1 className="text-7xl font-bold tracking-tight">
            QR codes and error recovery
          </h1>
          <p className="text-2xl leading-relaxed text-muted-foreground">
            How can a scratched, dirty or half-covered QR code still work?
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {/* An invisible placeholder: FlyingQr.tsx draws the code on top of it */}
          <div data-qr-from className="invisible">
            <QrGrid qr={qr} cell={10} />
          </div>
          <p className="text-muted-foreground">Scan me with your phone :3</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-muted-foreground">
        <span>Scroll down</span>
        <ChevronDown className="size-6 animate-bounce" />
      </div>
    </section>
  );
}
