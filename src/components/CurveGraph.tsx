"use client";

import { CartesianGrid, ComposedChart, LabelList, Line, ReferenceLine, Scatter, XAxis, YAxis, ZAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { part, scan, type GraphState } from "@/lib/curve";

// Colours and legend labels for everything on the graph
const config = {
  message: { label: "Message", color: "var(--primary)" },
  backup: { label: "Backup", color: "var(--highlight)" },
  curve: { label: "Curve", color: "var(--foreground)" },
  guess: { label: "Could be any of these", color: "var(--muted-foreground)" },
  part0: { label: "Part 1", color: "var(--primary)" },
  part1: { label: "Part 2", color: "var(--success)" },
  part2: { label: "Part 3", color: "var(--highlight)" },
} satisfies ChartConfig;

// How long the curve takes to draw itself when `animate` is on
const DRAW_MS = 1500;

// Draws a graph state (see GraphState in lib/curve.ts). It only ever looks at
// the state it gets, so the same state always gives the same graph.
//   animate: curves draw themselves from left to right when they appear
export default function CurveGraph({
  state,
  animate = false,
  className,
}: {
  state: GraphState;
  animate?: boolean;
  className?: string;
}) {
  const { sent, fine, curve, ...scanned } = scan(state);
  const lost = state.lost ?? [];
  const showCurve = curve && !state.hideCurve;
  const guesses = state.hideCurve ? [] : scanned.guesses; // only once a curve is tried
  // The numbers that are left, as dots
  const points = fine.map((p) => ({ ...p, kind: p.x <= state.message.length ? "message" : "backup" }));
  const parts = state.parts ? fine.map((_, i) => part(fine, i)) : [];
  const lastX = sent.length;

  // The curves are drawn through many points close together, so they look
  // smooth: one row per x, one column per curve
  const samples: Record<string, number>[] = [];
  for (let x = 0.5; x <= lastX + 0.5; x += 0.05) {
    const row: Record<string, number> = { x };
    if (showCurve) row.curve = curve(x);
    parts.forEach((p, i) => (row[`part${i}`] = p(x)));
    guesses.forEach((g, i) => (row[`guess${i}`] = g(x)));
    samples.push(row);
  }

  // The y axis: all the points with some room around them (and 0 for the
  // parts), in round steps of 1, 2, 5, 10, 20, 50, ...
  // (It counts lost numbers too, so it doesn't jump around while numbers are
  // lost and rebuilt.)
  const ys = [...sent.map((p) => p.y), ...(parts.length ? [0] : [])];
  const pad = (Math.max(...ys) - Math.min(...ys)) * 0.25 || 1;
  const low = Math.min(...ys) - pad;
  const high = Math.max(...ys) + pad;
  const step = [1, 2, 5, 10, 20, 50, 100, 200, 500].find((s) => (high - low) / s <= 6) ?? 1000;
  const y: [number, number] = [Math.floor(low / step) * step, Math.ceil(high / step) * step];
  const yTicks = [];
  for (let tick = y[0]; tick <= y[1]; tick += step) yTicks.push(tick);

  // The legend: only what's on the graph
  const legend = (Object.keys(config) as (keyof typeof config)[]).filter(
    (key) =>
      points.some((p) => p.kind === key) ||
      (key === "curve" && showCurve) ||
      (key === "guess" && guesses.length > 0) ||
      (key.startsWith("part") && Number(key.slice(4)) < parts.length),
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-muted-foreground">
        {legend.map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="size-3 rounded-full" style={{ background: config[key].color }} />
            {config[key].label}
          </span>
        ))}
      </div>

      {/* min-h-0 lets the graph shrink to the space that's left */}
      <ChartContainer config={config} className="aspect-auto min-h-0 w-full flex-1 text-base">
        <ComposedChart data={samples} margin={{ top: 32, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.5, lastX + 0.5]}
            ticks={sent.map((p) => p.x)}
            tickFormatter={(x) => `x=${x}`}
          />
          {/* allowDataOverflow cuts off the curves where the graph ends */}
          <YAxis domain={y} ticks={yTicks} allowDataOverflow width={48} />
          {parts.length > 0 && <ReferenceLine y={0} stroke="var(--muted-foreground)" />}
          {/* Every lost number gets a "?" line */}
          {lost.map((x) => (
            <ReferenceLine
              key={x}
              x={x}
              stroke="var(--destructive)"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{ value: "?", position: "top", className: "fill-destructive text-2xl font-bold" }}
            />
          ))}
          <ZAxis range={[260, 260]} />

          {parts.map((_, i) => (
            <Line
              key={i}
              dataKey={`part${i}`}
              stroke={`var(--color-part${i})`}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {guesses.map((_, i) => (
            <Line
              key={i}
              dataKey={`guess${i}`}
              stroke="var(--color-guess)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={animate}
              animationDuration={DRAW_MS}
            />
          ))}
          {showCurve && (
            <Line
              dataKey="curve"
              stroke="var(--color-curve)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={animate}
              animationDuration={DRAW_MS}
            />
          )}

          {/* The points with their numbers */}
          {(["message", "backup"] as const).map((kind) => (
            <Scatter
              key={kind}
              data={points.filter((p) => p.kind === kind)}
              dataKey="y"
              fill={`var(--color-${kind})`}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="y"
                position="top"
                offset={12}
                className="pointer-events-none fill-foreground stroke-card stroke-[6px] text-lg font-semibold [paint-order:stroke]"
              />
            </Scatter>
          ))}
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
