"use client";

/**
 * UnderwaterBackdrop
 * ----------------------------------------------------------------------------
 * The post-dive page is not a flat fill: it is living water that darkens with
 * depth. This component layers, from back to front:
 *
 *   1. Dither noise   - static, breaks up gradient banding (kept even under
 *                       reduced motion, since it belongs to the gradient).
 *   2. Caustics       - two soft light-pool layers drifting against each other;
 *                       Sunlight + Twilight only, gone by CAUSTICS_END.
 *   3. Light shafts   - faint diagonal god-rays from the surface; Sunlight only,
 *                       gone by SHAFTS_END.
 *   4. Particle drift - a thin field of slow-rising motes on one low-count
 *                       canvas; denser near the surface, sparse in the deep.
 *
 * Everything sits BEHIND the page content (the content wrapper carries a higher
 * z-index) and is pointer-events-none + aria-hidden. Intensity is tied to real
 * scroll depth via CSS variables we write from a rAF-throttled scroll handler,
 * so React never re-renders while the visitor moves and the dive scrub upstream
 * stays smooth.
 *
 * prefers-reduced-motion: only the static dither + gradient remain. No drifting
 * layers, no canvas loop.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BACKDROP_DPR_CAP,
  CAUSTICS_END,
  PARTICLE_BASE,
  PARTICLE_MAX,
  SHAFTS_END,
} from "@/app/lib/dive.config";

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

// A tiny tiled fractal-noise SVG, used as a dither overlay to kill banding in
// the deep gradient. Static and cheap (rasterized once, repeated by the GPU).
const NOISE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number; // px/sec, negative = rising
  amp: number; // horizontal sway amplitude
  freq: number; // sway frequency
  phase: number;
  a: number; // base alpha
};

export default function UnderwaterBackdrop() {
  const [reduced, setReduced] = useState(false);
  const [decided, setDecided] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Depth factors shared between the scroll handler and the particle loop.
  // enter:   0 while still in the dive, 1 once we are in the underwater page.
  // surface: 1 at the handoff, 0 by SHAFTS_END (drives shafts).
  // upper:   1 at the handoff, 0 by CAUSTICS_END (drives caustics + particles).
  const depth = useRef({ enter: 0, surface: 1, upper: 1 });

  // Resolve reduced-motion before doing any animated work.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setDecided(true);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Animated engine: depth tracking + particle canvas. Skipped under reduced.
  useEffect(() => {
    if (!decided || reduced) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;

    // Where does <main> begin in the document? Depth is measured from there.
    let mainTop = 0;
    const measureMain = () => {
      const m = root.closest("main") as HTMLElement | null;
      mainTop = m ? m.offsetTop : 0;
    };

    // ---- Depth -> CSS variables (rAF-throttled passive scroll) -------------
    let queued = false;
    const applyDepth = () => {
      queued = false;
      const vh = window.innerHeight;
      const d = window.scrollY - mainTop; // px below the handoff (can be < 0)
      // Fade the whole backdrop in across the last half-viewport before main,
      // so none of it bleeds over the dive footage above.
      const enter = clamp((d + vh * 0.5) / (vh * 0.5), 0, 1);
      const surface = clamp(1 - Math.max(0, d) / SHAFTS_END, 0, 1);
      const upper = clamp(1 - Math.max(0, d) / CAUSTICS_END, 0, 1);
      depth.current = { enter, surface, upper };
      root.style.setProperty("--enter", enter.toFixed(3));
      root.style.setProperty("--surface", surface.toFixed(3));
      root.style.setProperty("--upper", upper.toFixed(3));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(applyDepth);
      }
    };

    // ---- Particle field -----------------------------------------------------
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    const spawn = (atBottom: boolean): Particle => {
      const r = 0.4 + Math.random() * 1.3;
      return {
        x: Math.random() * cssW,
        y: atBottom ? cssH + Math.random() * 40 : Math.random() * cssH,
        r,
        vy: -(6 + Math.random() * 16), // slow rise
        amp: 4 + Math.random() * 14,
        freq: 0.15 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        a: 0.12 + Math.random() * 0.4,
      };
    };

    const buildParticles = () => {
      const area = cssW * cssH;
      const count = Math.min(
        PARTICLE_MAX,
        Math.round(PARTICLE_BASE * (area / (1280 * 800)))
      );
      particles = Array.from({ length: Math.max(16, count) }, () =>
        spawn(false)
      );
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, BACKDROP_DPR_CAP);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    let last = performance.now();
    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp big gaps
      last = now;

      const { enter, upper } = depth.current;
      ctx.clearRect(0, 0, cssW, cssH);

      // While in the dive (enter ~0) or tab hidden, don't draw - just idle.
      if (enter > 0.02 && !document.hidden) {
        // Denser/brighter near the surface; still a few faint motes in the deep.
        const depthAlpha = (0.28 + 0.72 * upper) * enter;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.vy * dt;
          p.phase += p.freq * dt;
          const x = p.x + Math.sin(p.phase) * p.amp;
          if (p.y < -6) {
            const np = spawn(true);
            particles[i] = np;
            continue;
          }
          ctx.beginPath();
          ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,224,242,${(p.a * depthAlpha).toFixed(3)})`;
          ctx.fill();
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    measureMain();
    resize();
    applyDepth();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measureMain();
      resize();
      applyDepth();
    };
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [decided, reduced]);

  // Until resolved, render nothing (the gradient on <main> already paints).
  if (!decided) return null;

  // The dither overlay is shared by both paths (it belongs to the gradient).
  const dither = (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage: `url("${NOISE_URL}")`,
        backgroundSize: "140px 140px",
        opacity: 0.04,
        mixBlendMode: "overlay",
      }}
    />
  );

  // Reduced motion: static gradient + dither only, no drifting layers/canvas.
  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
      >
        {dither}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={
        {
          // Defaults so first paint (pre-scroll) is hidden over the dive.
          ["--enter" as string]: "0",
          ["--surface" as string]: "1",
          ["--upper" as string]: "1",
        } as CSSProperties
      }
    >
      {/* 2. CAUSTICS - two soft light-pool layers drifting against each other.
          Sunlight + Twilight only (fades with --upper), gone in the deep. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: "calc(0.11 * var(--upper) * var(--enter))",
          mixBlendMode: "screen",
        }}
      >
        <div
          className="absolute -inset-[10%]"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 42% 30% at 22% 26%, rgba(126,196,234,0.55), transparent 62%)",
              "radial-gradient(ellipse 34% 26% at 68% 38%, rgba(126,196,234,0.5), transparent 62%)",
              "radial-gradient(ellipse 30% 38% at 46% 72%, rgba(126,196,234,0.45), transparent 62%)",
              "radial-gradient(ellipse 48% 30% at 84% 78%, rgba(126,196,234,0.4), transparent 62%)",
            ].join(","),
            filter: "blur(9px)",
            animation: "caustics-drift-a 30s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute -inset-[10%]"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 38% 28% at 40% 18%, rgba(150,214,244,0.5), transparent 60%)",
              "radial-gradient(ellipse 32% 30% at 14% 64%, rgba(150,214,244,0.45), transparent 60%)",
              "radial-gradient(ellipse 36% 26% at 78% 56%, rgba(150,214,244,0.45), transparent 60%)",
            ].join(","),
            filter: "blur(11px)",
            animation: "caustics-drift-b 38s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* 3. LIGHT SHAFTS - faint diagonal god-rays from the top. Sunlight only
          (fades with --surface), masked to dissolve before Twilight. */}
      <div
        className="absolute inset-x-0 top-0 h-[80vh] overflow-hidden"
        style={{
          opacity: "calc(0.1 * var(--surface) * var(--enter))",
          mixBlendMode: "screen",
          maskImage: "linear-gradient(to bottom, black 0%, black 22%, transparent 64%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 22%, transparent 64%)",
        }}
      >
        <div
          className="absolute -inset-x-[15%] top-0 h-full"
          style={{
            backgroundImage:
              "linear-gradient(100deg, transparent 8%, rgba(196,224,245,0.55) 17%, transparent 26%, transparent 52%, rgba(196,224,245,0.45) 62%, transparent 72%, transparent 86%, rgba(196,224,245,0.4) 92%, transparent 99%)",
            filter: "blur(13px)",
            transformOrigin: "top center",
            animation: "shafts-drift 26s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* 4. PARTICLE DRIFT - one low-count canvas, denser near the surface. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.9 }}
      />

      {/* 1. DITHER - static anti-banding, on top so it textures everything. */}
      {dither}
    </div>
  );
}
