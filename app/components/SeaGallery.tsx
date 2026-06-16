"use client";

/**
 * SeaGallery
 * ----------------------------------------------------------------------------
 * The interests zone: a horizontal scroll-snap row of square ocean clips, deep
 * in the Midnight water. Manifest-driven (app/media.config.ts).
 *
 * SKILL NOTES
 *  - taste-skill: the row is the variance beat in a mostly-typographic page
 *    (DENSITY 3, VARIANCE 7) - imagery carries it, so there is ONE quiet
 *    caption slot that updates as items snap in, not a label under every tile.
 *    Caption type is the site's small tracked-uppercase treatment. No arrows,
 *    no dots - the peek of the next card and a thin progress line are the only
 *    affordances. One amber accent on the progress line only.
 *  - emil-motion: autoplay/pause is driven by IntersectionObserver (in-view
 *    only, never all at once); the caption crossfades on `--ease-out`; the
 *    depth parallax is a CSS view() timeline (globals.css), all gone under
 *    reduced motion. The only scroll listener is element-scoped (the row's own
 *    scrollLeft) to feed the progress line - never window scroll.
 *  - impeccable: posters are the pre-play / reduced-motion / data-saver state;
 *    a deep-water placeholder sits behind each media element so a loading or
 *    missing file still reads as intentional, not broken.
 */

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { GALLERY } from "@/app/media.config";

const ITEMS = GALLERY.filter((i) => i.enabled);

export default function SeaGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [active, setActive] = useState(0);
  // staticMode = reduced motion OR data-saver: posters only, no autoplay.
  const [staticMode, setStaticMode] = useState(false);

  // Resolve reduced-motion + data-saver once, before any playback.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setStaticMode(reduced || conn?.saveData === true);
  }, []);

  // Active item (caption) + autoplay-in-view. One IntersectionObserver rooted
  // on the scroller: the most-visible card sets the caption and plays; cards
  // scrolled away pause. Never plays everything at once.
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-idx]"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          const v = videoRefs.current[idx];
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setActive(idx);
            if (!staticMode && v) void v.play().catch(() => {});
          } else if (v && !v.paused) {
            v.pause();
          }
        }
      },
      { root, threshold: [0, 0.6, 1] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [staticMode]);

  // Thin progress line. Reads the ROW's own scrollLeft (element-scoped, not
  // window) on a rAF-throttled passive listener, writing a 0..1 var the CSS
  // bar scales from. This is an affordance for an element scroller, not a
  // window scroll-jack.
  useEffect(() => {
    const el = trackRef.current;
    const sec = sectionRef.current;
    if (!el || !sec) return;

    let raf = 0;
    let queued = false;
    const apply = () => {
      queued = false;
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      sec.style.setProperty("--gal-progress", p.toFixed(4));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(apply);
      }
    };

    apply();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Drag-to-scroll for mouse (touch / trackpad already drag natively). Honors
  // the grab cursor affordance without arrows.
  const drag = useRef({ down: false, startX: 0, startLeft: 0 });
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  if (ITEMS.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          In the water
        </h2>
      </div>

      {/* The row. Full-bleed scroller; cards are square and snap to center, so
          the next card always peeks at the edge. Parallax lives on the outer
          wrapper (CSS view() timeline) and never touches the horizontal scroll. */}
      <div className="gal-parallax mt-10 sm:mt-12">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="gal-track flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 sm:gap-6 sm:px-8"
        >
          {ITEMS.map((item, i) => (
            <figure
              key={item.id}
              data-idx={i}
              className="relative aspect-square w-[78vw] max-w-[440px] shrink-0 snap-center overflow-hidden rounded-2xl"
            >
              {/* Deep-water placeholder behind the media: a loading or missing
                  file still reads as intentional water, not a broken tile. */}
              <span aria-hidden className="gal-placeholder absolute inset-0" />

              {item.kind === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                >
                  {item.webm ? (
                    <source src={item.webm} type="video/webm" />
                  ) : null}
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* One quiet caption slot (updates on snap) + the thin progress line. */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-6 sm:px-8">
        <p
          key={active}
          className="gal-cap text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--muted)]"
        >
          {ITEMS[active]?.caption}
        </p>
        <div
          aria-hidden
          className="mt-4 h-px w-full overflow-hidden bg-[var(--hairline)]"
        >
          <div className="gal-progress h-px w-full bg-[var(--accent)]" />
        </div>
      </div>
    </section>
  );
}
