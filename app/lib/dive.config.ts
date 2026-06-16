/**
 * DIVE ENGINE - tunables
 * ----------------------------------------------------------------------------
 * Every dial for the scroll-scrubbed dive lives here. Nothing about the visual
 * rhythm should require touching the engine component.
 *
 * The deep-blue handoff color is NOT here on purpose: it lives as a single CSS
 * variable (--underwater-blue in globals.css) so the canvas can simply fade to
 * transparent and let that one color show through. One source of truth.
 */

/** Pixels of scroll travel per frame. Higher = more deliberate, slower dive. */
export const SCRUB_PER_FRAME = 16;

/**
 * Smoothing (lerp) factor applied each animation frame: current moves toward
 * target by this fraction. Lower = silkier and floatier, higher = snappier.
 * Range that feels good: ~0.10 to ~0.20.
 */
export const SMOOTH = 0.15;

/** Over the final N frames, the canvas dissolves to the solid underwater blue. */
export const FADEOUT_FRAMES = 12;

/**
 * TITLE CARD timing, in dive frames. The name is the largest thing on screen
 * and HOLDS fully visible while the surface shot is in view (through
 * TITLE_HOLD_FRAMES), then sinks + dissolves across TITLE_FADE_FRAMES so it
 * goes down WITH the dive rather than snapping away.
 *
 * Calibrated to the clip (sampled luminance): the harbour surface stays bright
 * through ~frame 100, the plunge through the waterline runs ~frames 100-128,
 * and it is fully deep water by ~frame 130. So we hold to 100 and fade across
 * the plunge. The eyebrow and the upper orienting line LEAD the name by
 * EYEBROW_LEAD_FRAMES (they are "sky" and leave first).
 */
export const TITLE_HOLD_FRAMES = 100;
export const TITLE_FADE_FRAMES = 28;
export const TITLE_SINK_PX = 42; // how far the card sinks as it dissolves
export const EYEBROW_LEAD_FRAMES = 12;

/**
 * The persistent corner wordmark fades in only once we are underwater, taking
 * the upper-left corner the orienting line just vacated (place -> identity).
 */
export const MARK_FADE_START_FRAME = 116;
export const MARK_FADE_END_FRAME = 138;

/**
 * One-time load nudge: once frames are ready and the visitor is at the top, the
 * dive auto-advances ~this many frames then eases back to 0, so the water
 * visibly responds and teaches that scroll drives it. Cancelled the instant the
 * visitor scrolls; skipped entirely under prefers-reduced-motion.
 */
export const NUDGE_FRAMES = 7;
export const NUDGE_DURATION_MS = 1100;

/** Retina cap. Backing store never exceeds this * CSS pixels. */
export const DPR_CAP = 2;

/**
 * UNDERWATER BACKDROP - depth thresholds (pixels of scroll INTO <main>, i.e.
 * below the dive handoff). The animated water layers fade with depth:
 *  - Light shafts live in the Sunlight band and are gone by SHAFTS_END.
 *  - Caustics live in Sunlight + Twilight and are gone by CAUSTICS_END.
 *  - Particles drift everywhere but thin out below the surface.
 * Tuned to the depth gradient stops in SiteContent so light and color agree.
 */
export const SHAFTS_END = 680;
export const CAUSTICS_END = 2100;

/** Particle field: kept deliberately low-count so the scrub never stutters. */
export const PARTICLE_BASE = 54; // scaled by viewport area, capped
export const PARTICLE_MAX = 80;
export const BACKDROP_DPR_CAP = 1.5; // the water canvas needs less than the dive

/**
 * A clip is one continuous image sequence. The engine plays CLIPS as a single
 * uninterrupted timeline, so chaining a second clip (e.g. a galaxy ascent)
 * later is just another entry here - no engine changes required.
 */
export type Clip = {
  /** Human label, also handy for debugging. */
  name: string;
  /** Public path to the frame directory (no trailing slash). */
  dir: string;
  /** Number of frames in the sequence. */
  frameCount: number;
  /** Zero-pad width of the frame index in filenames (e.g. 4 -> 0001). */
  pad: number;
  /** File extension without the dot. */
  ext: string;
};

export const CLIPS: Clip[] = [
  // Generated with ffmpeg minterpolate -> 48fps, then cwebp q82. See README seam.
  { name: "dive", dir: "/frames/dive", frameCount: 139, pad: 4, ext: "webp" },

  // FUTURE SEAM: chain the galaxy ascent here. The engine will treat it as a
  // continuous extension of the same scroll timeline.
  // { name: "galaxy", dir: "/frames/galaxy", frameCount: 0, pad: 4, ext: "webp" },
];

/** Build the public URL for a single frame within a clip (0-based index). */
function frameSrc(clip: Clip, i: number): string {
  return `${clip.dir}/${String(i + 1).padStart(clip.pad, "0")}.${clip.ext}`;
}

/** Flat, ordered list of every frame URL across all clips. */
export const FRAMES: string[] = CLIPS.flatMap((clip) =>
  Array.from({ length: clip.frameCount }, (_, i) => frameSrc(clip, i))
);

export const TOTAL_FRAMES = FRAMES.length;

/** First frame = LCP poster (golden-hour harbour). */
export const FIRST_FRAME = FRAMES[0];

/** Last frame = the static image shown for reduced-motion users (deep water). */
export const LAST_FRAME = FRAMES[TOTAL_FRAMES - 1];

/** Total scroll distance (px) the dive occupies, beyond one viewport. */
export const SCROLL_LENGTH = Math.max(0, (TOTAL_FRAMES - 1) * SCRUB_PER_FRAME);
