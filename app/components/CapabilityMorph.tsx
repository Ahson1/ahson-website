/* motion: gsap-motion */
"use client";

/**
 * CapabilityMorph - WHAT I BUILD. PARTICLE MOMENT #2 (the signature).
 * ----------------------------------------------------------------------------
 * One emblem-mode particle field, pinned, morphing through four monoline
 * glyphs on scroll: voice waveform -> RAG node-graph -> agent orbital -> the
 * studio "ai" mark. Each glyph is fully legible at its hold point; between
 * holds the field advects on a pseudo-curl flow so the morph reads as one
 * continuous system, never a hard cut. The final settle into the "ai" mark
 * leads straight into the CTA section below the pin.
 *
 * PLACEHOLDER CONTRACT SLOTS 4/5: glyph SVGs + the "ai" mark are sampled
 * from public/assets/ (site.config MORPH_GLYPHS). Swap files in place.
 *
 * Mobile keeps the moment with a reduced particle budget + DPR cap.
 * Reduced motion: a static grid of the four glyphs + labels, no canvas.
 */
import { useRef, useState } from "react";
import { MORPH_GLYPHS } from "@/app/lib/site.config";
import {
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";
import {
  clamp01,
  flowVector,
  particleBudget,
  sampleImagePoints,
  seededRandom,
  smoothstep,
  PARTICLE_DPR_CAP,
  type Point,
} from "@/app/lib/particles";

const SEGMENTS = MORPH_GLYPHS.length - 1; // 3 transitions between 4 holds

export default function CapabilityMorph() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [mode, setMode] = useState<"pending" | "live" | "static">("pending");

  useGSAP(
    () => {
      registerGsap();
      setMode(prefersReducedMotion() ? "static" : "live");
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (mode !== "live") return;
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;

      let disposed = false;
      let rafId = 0;
      let inView = false;
      let progress = 0;

      const count = particleBudget(1400, 520);
      const rand = seededRandom(11);
      // Per-particle stagger + size, fixed for the whole scrub.
      const stagger = Float32Array.from({ length: count }, () => rand() * 0.22);
      const sizes = Float32Array.from(
        { length: count },
        () => 1.1 + rand() * 1.1,
      );

      let sets: Point[][] = [];

      const dpr = Math.min(window.devicePixelRatio || 1, PARTICLE_DPR_CAP);
      let side = 0;

      const resize = () => {
        side = canvas.clientWidth; // square via CSS
        canvas.width = Math.round(side * dpr); // note: clears the canvas
        canvas.height = Math.round(side * dpr);
        draw(performance.now()); // repaint immediately, not on the next rAF
      };

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();

      const draw = (time: number) => {
        const ctx = canvas.getContext("2d");
        if (!ctx || sets.length < MORPH_GLYPHS.length || side === 0) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, side, side);

        const f = progress * SEGMENTS;
        const a = Math.min(SEGMENTS - 1, Math.floor(f));
        const local = f - a;
        // Hold plateaus at each end of the segment so glyphs are legible.
        const tt = smoothstep(clamp01((local - 0.16) / 0.68));

        const A = sets[a];
        const B = sets[a + 1];
        ctx.fillStyle = accent;

        for (let i = 0; i < count; i++) {
          const ti = smoothstep(
            clamp01((tt - stagger[i]) / (1 - stagger[i] * 0.9)),
          );
          const ax = A[i].x;
          const ay = A[i].y;
          let x = ax + (B[i].x - ax) * ti;
          let y = ay + (B[i].y - ay) * ti;

          // Advection drift mid-transition + a whisper of life at holds.
          const wob = ti * (1 - ti) * 0.06 + 0.0018;
          const fl = flowVector(x * 3 + i * 0.013, y * 3, time * 0.0005 + i);
          x += fl.x * wob;
          y += fl.y * wob;

          ctx.globalAlpha = 0.4 + 0.45 * Math.abs(Math.sin(i * 1.7 + 1));
          const px = x * side;
          const py = y * side;
          ctx.fillRect(px, py, sizes[i], sizes[i]);
        }
        ctx.globalAlpha = 1;

        // Label weights: nearest hold wins.
        labelRefs.current.forEach((el, k) => {
          if (!el) return;
          const w = clamp01(1 - Math.abs(f - k) * 2.4);
          el.style.opacity = String(w);
          el.style.transform = `translate3d(0, ${(1 - w) * 8}px, 0)`;
        });
      };

      const loop = (time: number) => {
        if (disposed) return;
        draw(time);
        if (inView) rafId = requestAnimationFrame(loop);
      };

      // Sample the four glyph point sets (normalized 0..1, drawn into the
      // middle 76% of the canvas so strokes never clip).
      Promise.all(
        MORPH_GLYPHS.map((g) => sampleImagePoints(g.src, count)),
      ).then((raw) => {
        if (disposed) return;
        sets = raw.map((pts, gi) =>
          pts.length > 0
            ? pts.map((p) => ({
                x: 0.12 + p.x * 0.76,
                y: 0.12 + p.y * 0.76,
              }))
            : // Missing asset: scatter ring so the moment degrades gracefully.
              Array.from({ length: count }, (_, i) => ({
                x: 0.5 + 0.3 * Math.cos((i / count) * Math.PI * 2 + gi),
                y: 0.5 + 0.3 * Math.sin((i / count) * Math.PI * 2 + gi),
              })),
        );
        resize();
        draw(performance.now());
      });

      window.addEventListener("resize", resize);
      resize();

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: `+=${SEGMENTS * 110}%`,
        pin: true,
        onUpdate: (self) => {
          progress = self.progress;
          // Scrub updates paint immediately; the rAF loop adds the idle life.
          draw(performance.now());
        },
        onToggle: (self) => {
          inView = self.isActive;
          if (inView) rafId = requestAnimationFrame(loop);
        },
      });

      return () => {
        disposed = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        st.kill();
      };
    },
    { scope: rootRef, dependencies: [mode] },
  );

  return (
    <section
      id="what-i-build"
      ref={rootRef}
      aria-label="What I build"
      className="relative"
    >
      {mode === "static" ? (
        /* ---------- REDUCED MOTION: static glyph grid ---------- */
        <div className="mx-auto max-w-5xl px-6 py-24">
          <p className="tel-label mb-10">What I build</p>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {MORPH_GLYPHS.map((g) => (
              <figure key={g.key} className="flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt=""
                  className="h-28 w-28 opacity-90"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(69%) sepia(61%) saturate(1900%) hue-rotate(165deg) brightness(103%)",
                  }}
                />
                <figcaption className="text-sm text-[var(--muted)]">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        /* ---------- LIVE: pinned particle morph ---------- */
        <div
          ref={stageRef}
          className="flex h-screen flex-col items-center justify-center px-6"
        >
          <p className="tel-label mb-6">What I build</p>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="block aspect-square w-[min(66vh,82vw,540px)]"
          />
          {/* Labels stack in one grid cell; the engine weights their opacity. */}
          <div className="relative mt-6 grid h-8 w-full max-w-md text-center">
            {MORPH_GLYPHS.map((g, i) => (
              <p
                key={g.key}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="col-start-1 row-start-1 text-base text-[var(--fg)] sm:text-lg"
                style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity, transform" }}
              >
                {g.label}
              </p>
            ))}
          </div>
          {/* SR users get the full capability list regardless of scrub state. */}
          <ul className="sr-only">
            {MORPH_GLYPHS.map((g) => (
              <li key={g.key}>{g.label}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
