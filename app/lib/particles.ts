/**
 * PARTICLES - shared sampling + math for the site's TWO particle moments.
 * ----------------------------------------------------------------------------
 *  #1 (subtle)    ProofRow: stream particles advect along splines and resolve
 *                 into the odometer numbers.
 *  #2 (signature) CapabilityMorph: an emblem field morphs through the glyph
 *                 sequence and settles into the "ai" mark above the CTA.
 *
 * Everything here is plain math - no DOM, no React - so both engines stay
 * small and testable. Glyph targets are sampled from the PLACEHOLDER SVGs in
 * public/assets/glyphs (white strokes on transparent; the sampler reads
 * alpha), so tomorrow's real SVGs re-feed the engines with zero code change.
 */

export type Point = { x: number; y: number };

/** Deterministic PRNG (mulberry32) so layouts are stable across renders. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Load an SVG (or any image) and sample `count` points from its opaque pixels.
 * Returns points normalized to 0..1 in both axes (of the drawn square).
 * Sampling is alpha-thresholded and shuffled with a seeded PRNG so every
 * glyph yields exactly `count` stable targets.
 */
export function sampleImagePoints(
  src: string,
  count: number,
  rasterSize = 220,
): Promise<Point[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = rasterSize;
      c.height = rasterSize;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve([]);
      ctx.drawImage(img, 0, 0, rasterSize, rasterSize);
      const data = ctx.getImageData(0, 0, rasterSize, rasterSize).data;

      const candidates: Point[] = [];
      for (let y = 0; y < rasterSize; y += 1) {
        for (let x = 0; x < rasterSize; x += 1) {
          if (data[(y * rasterSize + x) * 4 + 3] > 128) {
            candidates.push({ x: x / rasterSize, y: y / rasterSize });
          }
        }
      }
      resolve(pickPoints(candidates, count, 7));
    };
    img.onerror = () => resolve([]);
    img.src = src;
  });
}

/** Shuffle candidates deterministically and take/pad to exactly `count`. */
export function pickPoints(
  candidates: Point[],
  count: number,
  seed: number,
): Point[] {
  if (candidates.length === 0) return [];
  const rand = seededRandom(seed);
  const arr = candidates.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const out: Point[] = new Array(count);
  for (let i = 0; i < count; i++) out[i] = arr[i % arr.length];
  return out;
}

/** Cubic bezier point (for the ProofRow stream splines). */
export function cubicAt(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

export const smoothstep = (t: number): number => t * t * (3 - 2 * t);

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Cheap pseudo-curl flow: a smooth 2D vector field from layered sines. Used
 * to give transitioning particles drift so morphs read as advection, not a
 * linear tween. Deterministic in (x, y, t).
 */
export function flowVector(x: number, y: number, t: number): Point {
  const a =
    Math.sin(x * 5.3 + t * 0.7) + Math.sin(y * 3.7 - t * 0.5) * 0.6;
  const b =
    Math.cos(y * 4.9 - t * 0.6) + Math.cos(x * 3.1 + t * 0.8) * 0.6;
  return { x: a, y: b };
}

/** Device-aware particle budget: keep mobile + hi-DPR displays cheap. */
export function particleBudget(desktop: number, mobile: number): number {
  if (typeof window === "undefined") return desktop;
  const small = window.matchMedia("(max-width: 768px)").matches;
  return small ? mobile : desktop;
}

export const PARTICLE_DPR_CAP = 1.5;
