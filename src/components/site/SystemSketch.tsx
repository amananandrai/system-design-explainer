import type { Sketch } from "@/lib/sketch";

const W = 66;
const H = 22;
/** Top-left corner of each slot in a 320×100 drawing. */
const slots = [
  [4, 39],
  [88, 39],
  [172, 10],
  [172, 68],
  [250, 39],
] as const;

const paths: Record<string, string> = {
  "0-1": "M70 50H88",
  "1-2": "M154 50H163V21H172",
  "1-3": "M154 50H163V79H172",
  "2-4": "M238 21H244V45H250",
  "3-4": "M238 79H244V55H250",
};

/** Blueprint thumbnail at the top of a system card. Decorative: the card text carries the meaning. */
export default function SystemSketch({ sketch, animated = false }: { sketch: Sketch; animated?: boolean }) {
  return (
    <svg viewBox="0 0 320 100" className="block h-auto w-full" aria-hidden>
      {sketch.links.map((link) => (
        <path
          key={link}
          d={paths[link]}
          fill="none"
          stroke="var(--cat)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className={animated ? "sketch-edge sketch-edge-live" : "sketch-edge"}
        />
      ))}
      {sketch.labels.map((label, i) => {
        if (!label) return null;
        const [x, y] = slots[i];
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={W}
              height={H}
              rx="2"
              fill={i === 1 ? "color-mix(in srgb, var(--cat) 14%, var(--surface))" : "var(--surface)"}
              stroke={i === 1 ? "var(--cat)" : "var(--line-strong)"}
            />
            <text
              x={x + W / 2}
              y={y + 14}
              textAnchor="middle"
              fill="var(--fg-soft)"
              fontSize="8.5"
              className="font-mono"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
