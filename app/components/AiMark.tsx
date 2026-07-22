/**
 * AiMark - the studio "ai" logo as an inline SVG animation.
 * ----------------------------------------------------------------------------
 * Traced from the real signature GIF (ahsonbuilds_signature2.gif): a 7x5-cell
 * pixel-art "a" plus a 3x5 cursor block that blinks on the terminal cadence
 * (400ms on / 400ms off), with a soft glow that breathes over 2.4s. Inline SVG
 * instead of the GIF so it sits on ANY background with no black box or fringe,
 * stays crisp at every size, and weighs ~1KB.
 *
 * Glow radius is a CSS px value, so small placements (nav) should shrink it:
 * pass e.g. className="[--ai-glow:2.5px]". Animations live in globals.css
 * (.ai-glow / .ai-cursor) and are killed by the global reduced-motion rule.
 */

/** Pixel grid of the "a", in 10-unit cells: x, y, w, h. */
const A_RECTS: [number, number, number, number][] = [
  [10, 0, 50, 10],
  [50, 10, 20, 10],
  [10, 20, 60, 10],
  [0, 30, 20, 10],
  [50, 30, 20, 10],
  [10, 40, 60, 10],
];
const CURSOR: [number, number, number, number] = [84, 0, 30, 50];

const WHITE = "#F7FDFF";
const CYAN = "#76D2FF";

function Glyph({ crisp }: { crisp?: boolean }) {
  return (
    <g shapeRendering={crisp ? "crispEdges" : undefined}>
      {A_RECTS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={WHITE} />
      ))}
      <rect
        className="ai-cursor"
        x={CURSOR[0]}
        y={CURSOR[1]}
        width={CURSOR[2]}
        height={CURSOR[3]}
        fill={CYAN}
      />
    </g>
  );
}

export default function AiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 114 50"
      className={`ai-mark ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft copy behind = the breathing glow; crisp copy on top. */}
      <g className="ai-glow">
        <Glyph />
      </g>
      <Glyph crisp />
    </svg>
  );
}
