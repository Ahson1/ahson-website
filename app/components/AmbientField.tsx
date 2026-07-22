"use client";

/**
 * AmbientField - the global background water.
 * ----------------------------------------------------------------------------
 * A fixed, full-viewport canvas painted BEHIND everything (-z-10): a sparse
 * cyan-tinted particle field in slow upward drift over the deep-navy --bg, so
 * the hero's ocean carries down the whole page as atmosphere. It must never
 * compete with content: drift alphas stay in the 0.15-0.25 band and the field
 * has no interaction with layout.
 *
 * POINTER BUBBLES (desktop only): a barely-there emitter spawns a few bubbles
 * at the cursor that rise and fade. The cyan reticle cursor stays the hero;
 * this is secondary texture. Hard-gated behind (pointer: fine) - touch devices
 * never attach the listener.
 *
 * PERF: shares the site particle budget helpers (particleBudget /
 * PARTICLE_DPR_CAP), pauses when the tab is hidden, and under
 * prefers-reduced-motion renders nothing at all - the static navy --bg is the
 * fallback.
 */
import { useEffect, useRef } from "react";
import {
  PARTICLE_DPR_CAP,
  particleBudget,
  seededRandom,
} from "@/app/lib/particles";

type Drifter = {
  x: number; // 0..1 of width
  y: number; // px
  r: number; // radius px
  vy: number; // px/s upward
  sway: number; // lateral sine amplitude px
  phase: number;
  alpha: number;
};

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number; // 0..1 remaining
  decay: number; // per second
};

const BUBBLE_POOL = 32;
const BUBBLE_INTERVAL_MS = 70;

export default function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;

    // Cyan tint from the live accent, at ambient strength.
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#35c9ff";

    let disposed = false;
    let rafId = 0;
    let running = false;
    let last = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        small ? 1 : PARTICLE_DPR_CAP,
      );
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ---- Drift field --------------------------------------------------------
    const rand = seededRandom(11);
    const drifters: Drifter[] = Array.from(
      { length: particleBudget(120, 48) },
      () => ({
        x: rand(),
        y: rand() * window.innerHeight,
        r: 0.6 + rand() * 1.3,
        vy: 5 + rand() * 10,
        sway: 4 + rand() * 10,
        phase: rand() * Math.PI * 2,
        alpha: 0.15 + rand() * 0.1,
      }),
    );

    // ---- Pointer bubbles (desktop only) ------------------------------------
    const bubbles: Bubble[] = [];
    let lastSpawn = 0;
    const onPointer = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < BUBBLE_INTERVAL_MS) return;
      lastSpawn = now;
      if (bubbles.length >= BUBBLE_POOL) bubbles.shift();
      bubbles.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 6,
        r: 1 + Math.random() * 1.6,
        vy: 26 + Math.random() * 22,
        vx: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.8 + Math.random() * 0.5,
      });
    };

    // ---- Frame loop ---------------------------------------------------------
    const tick = (now: number) => {
      if (disposed || !running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = accent;

      for (const p of drifters) {
        p.y -= p.vy * dt;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random();
        }
        const x = p.x * w + Math.sin(t * 0.4 + p.phase) * p.sway;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.life -= b.decay * dt;
        if (b.life <= 0) {
          bubbles.splice(i, 1);
          continue;
        }
        b.y -= b.vy * dt;
        b.x += b.vx * dt;
        ctx.globalAlpha = 0.3 * b.life;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (0.6 + 0.4 * b.life), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (fine) window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
