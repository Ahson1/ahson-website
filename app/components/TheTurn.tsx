import { COSMOS } from "@/app/media.config";

/**
 * TheTurn
 * ----------------------------------------------------------------------------
 * The ocean -> cosmos payoff: at the bottom of the descent the deep water runs
 * out and opens into night sky. The emotional peak before contact.
 *
 * SKILL NOTES
 *  - taste-skill: this is the page's one full-bleed moment (VARIANCE 7) - it
 *    must feel like a TURN, not the next section, so it breaks the column,
 *    fills the viewport, and carries at most one quiet line. One amber accent
 *    is deliberately ABSENT here; the light is starlight.
 *  - emil-motion: the only motion is a slow starfield twinkle + a gentle photo
 *    drift, both pure CSS and both removed under reduced motion (globals.css).
 *    Nothing is scroll-jacked.
 *  - impeccable: the CSS starfield is the BASE layer so the moment works with no
 *    photo at all; milkyway.jpg layers on top via background-image (a missing
 *    file simply reveals the starfield, never a broken <img>). The top edge is a
 *    handoff gradient from --depth-abyss so the water visibly bottoms out into
 *    stars - the same single-knob handoff trick the dive uses.
 */
export default function TheTurn() {
  return (
    <section className="turn relative isolate flex min-h-[92dvh] w-full flex-col items-center justify-center overflow-hidden">
      {/* Base night sky (deepest, behind everything). */}
      <span aria-hidden className="turn-sky absolute inset-0" />
      {/* Soft galaxy band. */}
      <span aria-hidden className="turn-band absolute inset-0" />
      {/* Two star layers at different depths (the back one twinkles). */}
      <span aria-hidden className="turn-stars turn-stars-back absolute inset-0" />
      <span aria-hidden className="turn-stars turn-stars-front absolute inset-0" />
      {/* The real Milky Way photo, layered over the starfield once present. */}
      <span
        aria-hidden
        className="turn-photo absolute inset-0"
        style={{ backgroundImage: `url(${COSMOS.src})` }}
      />
      {/* Handoff: deep water bottoming out into the stars along the top edge. */}
      <span aria-hidden className="turn-handoff absolute inset-x-0 top-0" />

      {/* One quiet line. Let the sky do the rest. */}
      <p className="relative z-10 max-w-lg text-balance px-6 text-center text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
        The water runs out, and the sky keeps going.
      </p>

      {/* Quiet location credit, low in the corner. */}
      <p className="absolute bottom-6 right-6 z-10 text-[11px] font-medium uppercase tracking-[0.28em] text-[color-mix(in_oklab,var(--foreground)_55%,transparent)]">
        {COSMOS.caption}
      </p>
    </section>
  );
}
