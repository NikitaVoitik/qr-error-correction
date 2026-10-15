import { ChevronDown } from "lucide-react";
import QrGrid from "@/components/QrGrid";
import { Badge } from "@/components/ui/badge";
import { makeQr } from "@/lib/qr";

// What the QR code on the start screen says when someone scans it
const GREETING = "Hi! Today: QR codes and error recovery";

// The first screen: a title slide that fills the whole window
export default function StartScreen() {
  const qr = makeQr(GREETING, "H");

  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-12 px-6 py-16">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <Badge variant="secondary" className="text-sm">
            Today
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
            QR codes and error recovery
          </h1>
          <p className="text-2xl leading-relaxed text-muted-foreground">
            How can a scratched, dirty or half-covered QR code still work?
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <QrGrid qr={qr} cell={10} />
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
