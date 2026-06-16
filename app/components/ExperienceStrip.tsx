"use client";

/**
 * ExperienceStrip
 * ----------------------------------------------------------------------------
 * The quiet row of places I have built. A CREDIBILITY SIGNAL, not a client
 * list: it sits in the Sunlight zone between the hero copy and Selected Work -
 * the headline says what I do, this shows where I have done it, then the work
 * goes deep.
 *
 * Deliberate non-choices (anti-slop):
 *  - No "trusted by" / vendor framing. One understated, optional label.
 *  - No imported brand-colour logos at mismatched quality. Clean monochrome
 *    WORDMARKS in one type treatment read editorial and dodge that problem.
 *    (Real SVG logos, if ever added, must be monochromed to match.)
 *  - No infinite auto-scrolling logo belt. A clean revealed row is the default;
 *    the only motion is a slight reveal and a subtle parallax drift as the band
 *    passes - both gone entirely under prefers-reduced-motion.
 *
 * Optical sizing: the marks are balanced by visual weight, not boxed to equal
 * widths. A long wordmark and a short one are tuned (per-mark font-size) to feel
 * the same size, so the row reads evenly rather than mechanically.
 *
 * MOTION OWNERSHIP (skill-driven): all timing/easing lives in globals.css
 * (`.xp-mark`, `.xp-reveal`, `.xp-row` parallax). This component only DECIDES
 * WHEN to arm and reveal the row. No scroll listener, no rAF, no setTimeout
 * cascade - the stagger is a pure CSS transition-delay keyed off each mark's
 * `--i`, and the parallax is a CSS view() timeline. The single source of motion
 * truth is the stylesheet.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Companies, in display order. `size` is the optical font-size that balances
 * each mark by visual weight (short words carry larger, long/wide words
 * smaller) so none dominates. Tuned quiet for a DENSITY-3 read. Easy to edit
 * and reorder.
 */
const COMPANIES: { name: string; size: string }[] = [
  { name: "HealthEngine", size: "1.4rem" },
  { name: "Avoca", size: "1.62rem" },
  { name: "Accelevate", size: "1.48rem" },
  { name: "Locum Motion", size: "1.36rem" },
];

export default function ExperienceStrip() {
  const rowRef = useRef<HTMLDivElement>(null);
  // Both reveal classes are React state (never imperative classList) so a
  // re-render can't wipe one and desync the `.is-armed.is-revealed` selector.
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Arm + reveal. Under reduced motion we never arm, so the marks rest at their
  // natural opacity with no movement. With motion we arm first (marks jump to
  // their hidden start state while below the fold), then reveal once the row
  // scrolls into view, so the browser sees a real start->end transition and the
  // staggered CSS transition-delay runs.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-20">
      {/* One quiet, understated label. Not "trusted by" - this is a CV signal. */}
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
        Where I&rsquo;ve built
      </p>

      {/* The marks. Single row on desktop, wrapping gracefully on mobile, with
          the blue breathing around them. The row owns the parallax (CSS
          view() timeline); each mark owns its reveal + hover (CSS). */}
      <div
        ref={rowRef}
        className={
          "xp-row mt-7 flex flex-wrap items-baseline gap-x-10 gap-y-5 sm:mt-8 sm:gap-x-14" +
          (armed ? " is-armed" : "") +
          (revealed ? " is-revealed" : "")
        }
      >
        {COMPANIES.map((c, i) => (
          // Outer: the staggered reveal (transform + opacity, ease-out).
          <span
            key={c.name}
            className="xp-reveal inline-block"
            style={{ ["--i" as string]: i } as CSSProperties}
          >
            {/* Inner: resting dim + snappy hover lift (opacity only, `ease`). */}
            <span
              className="xp-mark block select-none font-medium leading-none tracking-[-0.01em] text-[var(--foreground)]"
              style={{ fontSize: c.size }}
            >
              {c.name}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
