"use client";

/**
 * DepthGauge
 * ----------------------------------------------------------------------------
 * A thin vertical depth scale pinned to the right edge. NOT a "scroll" arrow:
 * it reads as instrumentation. 0 m sits at the top; a small marker tracks the
 * visitor's real scroll depth down through the ocean zones, and a live metre
 * readout ticks beside it. On the hero the marker rests at the very top, which
 * quietly implies there is depth below to descend into.
 *
 * Restraint:
 *  - Low opacity, fades further when the page is idle (no recent scroll).
 *  - Hidden on small screens (it earns its place only with room to breathe).
 *  - Purely decorative: aria-hidden and pointer-events-none.
 *  - Updates the DOM through refs on a rAF-throttled scroll handler, so it
 *    never triggers React re-renders while the visitor moves.
 */

import { useEffect, useRef } from "react";

/**
 * Ocean zones, top -> bottom. Each occupies an equal visual segment of the
 * gauge; the metre figures are the real-world depth ranges they label.
 */
const ZONES = [
  { name: "Sunlight", top: 0, bottom: 200 },
  { name: "Twilight", top: 200, bottom: 1000 },
  { name: "Midnight", top: 1000, bottom: 4000 },
  { name: "Abyss", top: 4000, bottom: 6000 },
] as const;

const IDLE_MS = 1300; // after this long without scrolling, the gauge dims
const OPACITY_ACTIVE = 0.6;
const OPACITY_IDLE = 0.22;

/** Map a 0..1 scroll progress onto a piecewise depth in metres. */
function depthForProgress(p: number): number {
  const seg = 1 / ZONES.length;
  const i = Math.min(ZONES.length - 1, Math.floor(p / seg));
  const z = ZONES[i];
  const local = (p - i * seg) / seg; // 0..1 within this zone's band
  return z.top + local * (z.bottom - z.top);
}

export default function DepthGauge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const marker = markerRef.current;
    const readout = readoutRef.current;
    if (!root || !marker || !readout) return;

    let raf = 0;
    let queued = false;
    let idleTimer = 0;

    const apply = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      marker.style.top = `${(p * 100).toFixed(2)}%`;
      readout.textContent = `${Math.round(depthForProgress(p))} m`;
    };

    const wake = () => {
      root.style.opacity = String(OPACITY_ACTIVE);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.style.opacity = String(OPACITY_IDLE);
      }, IDLE_MS);
    };

    const onScroll = () => {
      wake();
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(apply);
      }
    };

    apply();
    // Settle to the idle opacity shortly after mount.
    idleTimer = window.setTimeout(() => {
      root.style.opacity = String(OPACITY_IDLE);
    }, IDLE_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-20 hidden h-[58vh] -translate-y-1/2 sm:right-6 sm:block"
      style={{
        opacity: OPACITY_ACTIVE,
        transition: "opacity 600ms var(--ease-out)",
      }}
    >
      <div className="relative h-full">
        {/* The scale line. */}
        <div
          className="absolute right-0 top-0 h-full w-px"
          style={{ background: "var(--hairline)" }}
        />

        {/* Zone ticks + labels at each band boundary. */}
        {ZONES.map((z, i) => (
          <div
            key={z.name}
            className="absolute right-0 flex translate-y-[-50%] items-center gap-2"
            style={{ top: `${(i / ZONES.length) * 100}%` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {z.name}
            </span>
            <span
              className="h-px w-2"
              style={{ background: "var(--muted)", opacity: 0.6 }}
            />
          </div>
        ))}

        {/* Live marker: a small accent notch + metre readout that tracks depth. */}
        <div
          ref={markerRef}
          className="absolute right-0 flex translate-y-[-50%] items-center gap-2"
          style={{ top: "0%" }}
        >
          <span
            ref={readoutRef}
            className="font-mono text-[10px] tabular-nums text-[var(--accent)]"
          >
            0 m
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </div>
      </div>
    </div>
  );
}
