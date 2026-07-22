"use client";

/**
 * DiveScrubber
 * ----------------------------------------------------------------------------
 * A scroll-scrubbed image-sequence player on a <canvas>. This is the cinematic
 * centerpiece: the visitor scrolls and a continuous shot dives from Sydney
 * Harbour at golden hour down through the surface into deep water, then
 * dissolves onto the solid --underwater-blue that the rest of the site lives on.
 *
 * Design notes:
 *  - We do NOT scrub a <video> by currentTime (seeking stutters). We preload an
 *    image sequence and draw the right frame each rAF.
 *  - A passive scroll listener only updates a TARGET frame. The rAF loop lerps
 *    the displayed frame toward that target, so motion stays silky and is never
 *    coupled to scroll-event cadence.
 *  - The engine is self-contained. Site chrome wraps it; it never reaches out.
 *
 * All visual dials live in app/lib/dive.config.ts.
 */

import { useEffect, useRef, useState, type Ref } from "react";
import ScrollCue from "@/app/components/ScrollCue";
import {
  COORDS,
  CREDENTIAL,
  CREDENTIAL_LOGO_SRC,
  HERO_HEADLINE_LEAD,
  HERO_HEADLINE_QUALIFIER,
  HERO_SUBLINE,
} from "@/app/lib/site.config";
import {
  DPR_CAP,
  EYEBROW_LEAD_FRAMES,
  FADEOUT_FRAMES,
  FIRST_FRAME,
  FRAMES,
  LAST_FRAME,
  MARK_FADE_END_FRAME,
  MARK_FADE_START_FRAME,
  NUDGE_DURATION_MS,
  NUDGE_FRAMES,
  SCROLL_LENGTH,
  SMOOTH,
  TITLE_FADE_FRAMES,
  TITLE_HOLD_FRAMES,
  TITLE_SINK_PX,
  TOTAL_FRAMES,
} from "@/app/lib/dive.config";

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

// easeOutCubic-ish for the canvas dissolve (cubic-bezier(.23,1,.32,1) feel).
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The opening title card markup. Used both statically (poster / reduced-motion)
 * and, in the live scrub, where the engine drives the sub-element refs so the
 * eyebrow + the upper orienting line lead the (huge) name as it sinks.
 *
 * Composition:
 *  - Upper-left: one quiet orienting line over the dead sky (negative space).
 *  - Lower-left over the calm water: the NAME huge, then the headline one step
 *    down (eyebrowRef rides the headline so it leads the name into the sink).
 */
function TitleCard({
  eyebrowRef,
  orientRef,
}: {
  eyebrowRef?: Ref<HTMLParagraphElement>;
  orientRef?: Ref<HTMLDivElement>;
} = {}) {
  return (
    <>
      {/* Soft bottom scrim - legibility for the large name over bright water. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
      />

      {/* TOP SPACE - orientation + the real coordinate tag anchor the
          upper-left; the sky between them and the name stays negative space. */}
      <div
        ref={orientRef}
        className="absolute left-8 top-8 sm:left-12 sm:top-12"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
          Sydney Harbour
        </p>
        <p className="tel-label mt-2 !text-white/45 normal-case !tracking-[0.14em]">
          {COORDS}
        </p>
      </div>

      {/* NAME + HEADLINE - the NAME is the single largest element on the card
          (primary); the headline sits beneath it one type step down
          (secondary). The subline carries the positioning, quietly. */}
      {/* A soft dark text-shadow rides the whole block so the type holds its
          edge over the bright water without needing a heavier scrim. */}
      <div
        className="absolute bottom-0 left-0 max-w-[94vw] p-8 pb-24 sm:p-12 sm:pb-24"
        style={{
          textShadow:
            "0 2px 18px rgba(3, 12, 24, 0.55), 0 1px 3px rgba(3, 12, 24, 0.45)",
        }}
      >
        <h1
          className="font-display max-w-5xl font-semibold uppercase leading-[0.96] tracking-[-0.015em] text-white"
          style={{ fontSize: "clamp(2.7rem, 8.5vw, 6.75rem)" }}
        >
          Ahson Kamal
        </h1>
        {/* Depth inside the headline itself: bright semibold lead clause,
            then the qualifier a weight down in the muted accent tint. */}
        <p
          ref={eyebrowRef}
          className="mt-5 max-w-2xl leading-snug tracking-tight"
          style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)" }}
        >
          <span className="font-semibold text-white">
            {HERO_HEADLINE_LEAD}
          </span>{" "}
          <span
            className="font-normal"
            style={{
              color: "color-mix(in oklab, var(--accent) 62%, #ffffff 38%)",
            }}
          >
            {HERO_HEADLINE_QUALIFIER}
          </span>
        </p>
        <p className="mt-4 max-w-xl text-sm leading-snug text-white/70 sm:text-base">
          {HERO_SUBLINE}
        </p>
        {/* Credential line: quiet, one step below the positioning, with the
            USYD mark riding alongside at label height. */}
        <p className="mt-3 flex items-center gap-2.5 text-xs text-white/50 sm:text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CREDENTIAL_LOGO_SRC}
            alt="University of Sydney"
            className="h-6 w-auto opacity-70 sm:h-7"
          />
          <span>{CREDENTIAL}</span>
        </p>
      </div>

      {/* SCROLL SIGNIFIER - bottom center, unmissable. */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <ScrollCue />
      </div>
    </>
  );
}

export default function DiveScrubber() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null); // title group (sinks + fades)
  const eyebrowRef = useRef<HTMLParagraphElement>(null); // leads the name
  const orientRef = useRef<HTMLDivElement>(null); // upper-left, leads most
  const markRef = useRef<HTMLDivElement>(null); // corner wordmark (fades in)

  // Loading + capability state drives what we render.
  const [reduced, setReduced] = useState(false);
  const [decided, setDecided] = useState(false); // resolved reduced-motion yet?
  const [ready, setReady] = useState(false); // all frames decoded
  const [progress, setProgress] = useState(0); // 0..1 for the minimal loader

  // Resolve prefers-reduced-motion before doing any heavy work.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setDecided(true);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The scrub engine. Only runs when motion is allowed.
  useEffect(() => {
    if (!decided || reduced) return;

    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;
    let started = false;

    const images: (HTMLImageElement | undefined)[] = new Array(TOTAL_FRAMES);
    let current = 0; // displayed frame (float)
    let target = 0; // scroll-derived frame (float)

    // One-time load nudge: once frames are ready and we're at the top, the dive
    // auto-advances a few frames then eases back to 0, so the water visibly
    // responds and teaches that scroll drives it. Cancelled on first real scroll.
    let nudgeActive = false;
    let nudgeStart = 0;

    // ---- Sizing (retina-aware cover fit) ------------------------------------
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(Math.round(current), true);
    };

    const drawFrame = (index: number, force = false) => {
      const img = images[clamp(index, 0, TOTAL_FRAMES - 1)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (cssW === 0 || cssH === 0) return;

      // cover-fit: fill the viewport, preserve aspect, center.
      const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (cssW - dw) / 2;
      const dy = (cssH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      // Dissolve to the solid underwater blue over the final frames so the
      // scrub lands with no visible seam onto the page background.
      const fadeStart = TOTAL_FRAMES - 1 - FADEOUT_FRAMES;
      const fade = clamp((current - fadeStart) / FADEOUT_FRAMES, 0, 1);
      canvas.style.opacity = String(1 - easeOut(fade));

      if (force) {
        /* no-op marker; kept for readability */
      }
    };

    // ---- Scroll -> target frame (passive; never debounced) ------------------
    const updateTarget = () => {
      // Any real scroll cancels the one-time load nudge immediately.
      if (nudgeActive) nudgeActive = false;
      const rect = stage.getBoundingClientRect();
      const maxScroll = stage.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = maxScroll > 0 ? clamp(scrolled / maxScroll, 0, 1) : 0;
      target = p * (TOTAL_FRAMES - 1);
    };

    // ---- rAF loop: lerp current toward target, draw every frame -------------
    const tick = () => {
      if (disposed) return;

      // One-time nudge owns `target` while active: a single out-and-back swell
      // (0 -> NUDGE_FRAMES -> 0) eased on both legs, then it releases control.
      if (nudgeActive) {
        const t = clamp(
          (performance.now() - nudgeStart) / NUDGE_DURATION_MS,
          0,
          1
        );
        if (t >= 1) {
          nudgeActive = false;
          target = 0;
        } else if (t < 0.5) {
          target = easeOut(t / 0.5) * NUDGE_FRAMES;
        } else {
          target = (1 - easeOut((t - 0.5) / 0.5)) * NUDGE_FRAMES;
        }
      }

      const diff = target - current;
      if (Math.abs(diff) < 0.01) {
        current = target;
      } else {
        current += diff * SMOOTH;
      }
      drawFrame(Math.round(current));

      // Title cross-fade, driven by the same float frame for smoothness and
      // fully reversible when scrolling back up to the surface. The whole group
      // HOLDS until the plunge through the waterline, then sinks + dissolves
      // with the dive; the eyebrow and orienting line LEAD it; the corner
      // wordmark fades in once we are underwater.
      const groupP = clamp(
        (current - TITLE_HOLD_FRAMES) / TITLE_FADE_FRAMES,
        0,
        1
      );
      const groupE = easeOut(groupP);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(1 - groupE);
        titleRef.current.style.transform = `translate3d(0, ${
          groupE * TITLE_SINK_PX
        }px, 0)`;
      }
      // Eyebrow leads the name (its own fade begins EYEBROW_LEAD_FRAMES earlier).
      if (eyebrowRef.current) {
        const eP = clamp(
          (current - (TITLE_HOLD_FRAMES - EYEBROW_LEAD_FRAMES)) /
            TITLE_FADE_FRAMES,
          0,
          1
        );
        eyebrowRef.current.style.opacity = String(1 - easeOut(eP));
      }
      // Orienting line is "sky": it leads furthest and rides a low base opacity.
      if (orientRef.current) {
        const oP = clamp(
          (current - (TITLE_HOLD_FRAMES - EYEBROW_LEAD_FRAMES * 1.8)) /
            TITLE_FADE_FRAMES,
          0,
          1
        );
        orientRef.current.style.opacity = String(0.55 * (1 - easeOut(oP)));
      }
      // Persistent wordmark fades in once underwater, taking the vacated corner.
      if (markRef.current) {
        const mP = clamp(
          (current - MARK_FADE_START_FRAME) /
            (MARK_FADE_END_FRAME - MARK_FADE_START_FRAME),
          0,
          1
        );
        markRef.current.style.opacity = String(easeOut(mP) * 0.85);
      }

      rafId = requestAnimationFrame(tick);
    };

    // ---- Preload all frames, with progress ----------------------------------
    let loaded = 0;
    const onOne = () => {
      loaded += 1;
      setProgress(loaded / TOTAL_FRAMES);
      if (loaded >= TOTAL_FRAMES && !disposed) {
        setReady(true);
        resize();
        // Arm the load nudge only if the visitor is still at the very top and
        // hasn't already started scrolling through the dive.
        if (window.scrollY < 4 && current < 0.5) {
          nudgeActive = true;
          nudgeStart = performance.now();
        }
      }
    };

    const preload = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = onOne;
        img.onerror = onOne; // keep progress honest even if one fails
        img.src = FRAMES[i];
        images[i] = img;
      }
    };

    // ---- Lazy init: only spin up when the stage is near the viewport --------
    const start = () => {
      if (started) return;
      started = true;
      preload();
      resize();
      updateTarget();
      window.addEventListener("scroll", updateTarget, { passive: true });
      window.addEventListener("resize", resize);
      rafId = requestAnimationFrame(tick);
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            io?.disconnect();
            io = null;
          }
        },
        { rootMargin: "200% 0px" }
      );
      io.observe(stage);
    } else {
      start();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", resize);
      io?.disconnect();
    };
  }, [decided, reduced]);

  // ---- Render -------------------------------------------------------------

  // Until we know the motion preference, render just the poster so the LCP
  // paints immediately and we never flash the wrong path.
  if (!decided) {
    return (
      <section
        aria-label="Cinematic dive from Sydney Harbour into deep water"
        className="relative h-[100dvh] w-full overflow-hidden bg-[var(--underwater-blue)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FIRST_FRAME}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0">
          <TitleCard />
        </div>
      </section>
    );
  }

  // Reduced motion: no scrub. Show the deep-water end frame, statically.
  if (reduced) {
    return (
      <section
        aria-label="Deep water, the destination of the dive"
        className="relative h-[100dvh] w-full overflow-hidden bg-[var(--underwater-blue)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LAST_FRAME}
          alt="Sunlight filtering down through deep blue water."
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0">
          <TitleCard />
        </div>
      </section>
    );
  }

  // Full scrub. Tall stage provides scroll length; sticky child pins the canvas.
  return (
    <section
      ref={stageRef}
      aria-label="Cinematic dive from Sydney Harbour into deep water"
      className="relative w-full bg-[var(--underwater-blue)]"
      style={{ height: `calc(100dvh + ${SCROLL_LENGTH}px)` }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[var(--underwater-blue)]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block h-full w-full"
          style={{ willChange: "opacity" }}
        />

        {/* LCP poster: a real <img> of the first frame, painted instantly and
            faded out once every frame has decoded. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={posterRef}
          src={FIRST_FRAME}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-[cubic-bezier(.23,1,.32,1)]"
          style={{ opacity: ready ? 0 : 1 }}
        />

        {/* Minimal loader: one thin accent line, no spinner, no dots. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px bg-[var(--accent)] transition-opacity duration-300"
          style={{
            width: `${Math.round(progress * 100)}%`,
            opacity: ready ? 0 : 0.7,
          }}
        />

        {/* Opening title card - fades out + sinks as the dive begins (rAF-driven). */}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-0"
          style={{ willChange: "opacity, transform" }}
        >
          <TitleCard eyebrowRef={eyebrowRef} orientRef={orientRef} />
        </div>

        {/* Persistent corner wordmark - fades in as the title sinks, then stays. */}
        <div
          ref={markRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-6 text-sm font-medium tracking-tight text-white sm:left-8 sm:top-8"
          style={{ opacity: 0, willChange: "opacity" }}
        >
          Ahson Kamal
        </div>
      </div>
    </section>
  );
}
