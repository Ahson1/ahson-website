/* motion: gsap-motion */
"use client";

/**
 * ProofRow - the mono-numeral odometer row. PARTICLE MOMENT #1 (subtle).
 * ----------------------------------------------------------------------------
 * Six approved resume stats in tabular mono, framed by corner brackets. On
 * first entry the digits roll up odometer-style while a quiet stream of
 * particles advects along cubic splines from the left edge and resolves INTO
 * the number blocks. This is the low-key dynamic beat - the signature moment
 * lives in CapabilityMorph.
 *
 * Fallbacks: SSR / no-JS / prefers-reduced-motion render the final numbers
 * statically; the canvas never mounts. Particle count + DPR are capped.
 */
import { useRef, useState } from "react";
import CornerFrame from "@/app/components/CornerFrame";
import { STATS } from "@/app/lib/site.config";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";
import {
  cubicAt,
  clamp01,
  flowVector,
  particleBudget,
  seededRandom,
  smoothstep,
  PARTICLE_DPR_CAP,
} from "@/app/lib/particles";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** One stat value. When `armed`, digits become 0-9 roll strips. */
function OdoValue({ value, armed }: { value: string; armed: boolean }) {
  return (
    <span className="odo font-mono-num" data-odo-value>
      {value.split("").map((ch, i) =>
        /[0-9]/.test(ch) && armed ? (
          <span key={i} className="odo-digit">
            <span className="odo-strip" data-odo-target={ch}>
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

type StreamParticle = {
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  delay: number;
  dur: number;
  size: number;
};

export default function ProofRow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      if (prefersReducedMotion()) return; // static numbers, no canvas
      setArmed(true);
    },
    { scope: rootRef },
  );

  // Second pass once `armed` has re-rendered the roll strips into the DOM.
  useGSAP(
    () => {
      if (!armed) return;
      const panel = panelRef.current;
      const canvas = canvasRef.current;
      if (!panel || !canvas) return;

      const strips = gsap.utils.toArray<HTMLElement>("[data-odo-target]");
      gsap.set(strips, { yPercent: 0 });

      let rafId = 0;
      let disposed = false;

      const play = () => {
        // --- Odometer roll -------------------------------------------------
        strips.forEach((strip, i) => {
          const d = Number(strip.dataset.odoTarget ?? 0);
          gsap.to(strip, {
            yPercent: -d * 10,
            duration: 1.3,
            delay: 0.25 + i * 0.05,
            ease: "prod",
          });
        });

        // --- Stream particles into the number blocks ----------------------
        const dpr = Math.min(window.devicePixelRatio || 1, PARTICLE_DPR_CAP);
        const w = panel.clientWidth;
        const h = panel.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const panelBox = panel.getBoundingClientRect();
        const targets = gsap.utils
          .toArray<HTMLElement>("[data-odo-value]")
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              x: r.left - panelBox.left,
              y: r.top - panelBox.top,
              w: r.width,
              h: r.height,
            };
          });
        if (targets.length === 0) return;

        const rand = seededRandom(21);
        const count = particleBudget(130, 55);
        const particles: StreamParticle[] = Array.from(
          { length: count },
          () => {
            const t = targets[Math.floor(rand() * targets.length)];
            const end = {
              x: t.x + rand() * t.w,
              y: t.y + rand() * t.h,
            };
            const start = { x: -12, y: rand() * h };
            return {
              p0: start,
              p1: { x: w * 0.28, y: start.y + (rand() - 0.5) * h * 0.5 },
              p2: { x: end.x - w * 0.14, y: end.y + (rand() - 0.5) * 40 },
              p3: end,
              delay: rand() * 0.9,
              dur: 1.2 + rand() * 0.9,
              size: 0.8 + rand() * 0.9,
            };
          },
        );

        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim();
        const t0 = performance.now();
        const TAIL = 0.55; // settle/fade time after arrival

        const tick = () => {
          if (disposed) return;
          const t = (performance.now() - t0) / 1000;
          ctx.clearRect(0, 0, w, h);
          let alive = false;

          for (const p of particles) {
            const u = clamp01((t - p.delay) / p.dur);
            if (u <= 0) {
              alive = true;
              continue;
            }
            const eased = smoothstep(u);
            const pos = cubicAt(p.p0, p.p1, p.p2, p.p3, eased);
            // Mid-flight drift so the stream reads as advection.
            const wob = u * (1 - u) * 14;
            const f = flowVector(pos.x / w, pos.y / h, t);
            const x = pos.x + f.x * wob;
            const y = pos.y + f.y * wob;

            // Alpha: quick fade in, hold quiet, dissolve after arrival.
            let a = Math.min(1, u * 6) * 0.5;
            if (u >= 1) {
              const settle = clamp01((t - p.delay - p.dur) / TAIL);
              a = 0.5 * (1 - settle);
              if (settle < 1) alive = true;
            } else {
              alive = true;
            }
            if (a <= 0.01) continue;
            ctx.globalAlpha = a;
            ctx.fillStyle = accent;
            ctx.fillRect(x, y, p.size, p.size);
          }
          ctx.globalAlpha = 1;

          if (alive) {
            rafId = requestAnimationFrame(tick);
          } else {
            gsap.to(canvas, { autoAlpha: 0, duration: 0.45, ease: "prod" });
          }
        };
        rafId = requestAnimationFrame(tick);
      };

      const st = ScrollTrigger.create({
        trigger: panel,
        start: "top 72%",
        once: true,
        onEnter: play,
      });

      return () => {
        disposed = true;
        cancelAnimationFrame(rafId);
        st.kill();
      };
    },
    { scope: rootRef, dependencies: [armed] },
  );

  return (
    <section id="proof" ref={rootRef} className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="tel-label mb-6">Proof / measured</p>
        <div ref={panelRef} className="frame relative px-6 py-10 sm:px-10 sm:py-12">
          <CornerFrame />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
          <div className="relative grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-y-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-medium text-[var(--fg)] sm:text-4xl">
                  <OdoValue value={s.value} armed={armed} />
                </p>
                <p className="mt-2.5 text-sm leading-snug text-[var(--muted)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
