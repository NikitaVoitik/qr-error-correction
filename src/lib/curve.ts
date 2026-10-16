// The idea behind Reed–Solomon, with normal numbers: put the message on a
// curve, and send extra points of the same curve as backups.

export type Point = { x: number; y: number };

// Lagrange interpolation: the one curve that goes through all the points
// (a line for 2 points, a parabola for 3, ...). It's the sum of one part per
// point, see part() below.
export function curveThrough(points: Point[]) {
  return (x: number) => points.reduce((sum, _, i) => sum + part(points, i)(x), 0);
}

// One point's part of the curve: it's exactly that point's y at its own x,
// and 0 at every other point's x. So adding up all the parts gives a curve
// that hits every point.
export function part(points: Point[], i: number) {
  return (x: number) => {
    let y = points[i].y;
    for (const [j, other] of points.entries()) {
      // (x - other.x) is 0 at the other point. Dividing by the same thing at
      // our own x makes it 1 there.
      if (j !== i) y *= (x - other.x) / (points[i].x - other.x);
    }
    return y;
  };
}

// Message numbers go at x = 1, 2, 3, ... and the backups after them
export function withBackups(message: number[], backups: number): Point[] {
  const points = message.map((y, i) => ({ x: i + 1, y }));
  const curve = curveThrough(points);
  for (let x = message.length + 1; x <= message.length + backups; x++) {
    points.push({ x, y: curve(x) });
  }
  return points;
}

// ---- The graph's state ------------------------------------------------------
// Everything on a graph comes from one of these. The story steps are states
// written out by hand, and the playground swaps in a new one on every click.

export type GraphState = {
  message: number[]; // e.g. [72, 101, 108] for "Hel"
  backups: number; // how many extra points to send
  lost?: number[]; // the x of every number that got lost
  hideCurve?: boolean; // only show the points, not the curve
  parts?: boolean; // also show the Lagrange parts of the curve
};

// What a scanner makes of a state: any `message.length` of the numbers that
// are left give back the curve.
export function scan({ message, backups, lost = [] }: GraphState) {
  const sent = withBackups(message, backups);
  const fine = sent.filter((p) => !lost.includes(p.x));
  const curve = fine.length >= message.length ? curveThrough(fine.slice(0, message.length)) : null;

  // Not enough left: lots of curves fit the points that are. Show a few, by
  // guessing different values for the missing ones. (One of them is the
  // real curve, but there's no way to tell which.)
  const missing = sent.filter((p) => lost.includes(p.x)).slice(0, message.length - fine.length);
  const guesses = curve
    ? []
    : [-2, -1, 0, 1, 2].map((k) => curveThrough([...fine, ...missing.map((p) => ({ x: p.x, y: p.y + k * 20 }))]));

  return { sent, fine, curve, guesses };
}
