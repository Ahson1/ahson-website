/* motion: gsap-motion */
"use client";

/**
 * The Intersection - the centrepiece.
 * ----------------------------------------------------------------------------
 * A pinned isometric "systems stack": five layers that light up cyan one at a
 * time as the visitor scroll-scrubs through the section. Each layer carries
 * one concrete proof line (site.config LAYERS). Precise and high-impact, not
 * busy: hairline plates, one accent, mono index.
 *
 * Desktop: ScrollTrigger pins the panel for 5 scrub segments.
 * Mobile / reduced motion: no pin - a vertical sequence of the five layers,
 * each block showing the stack with its own layer lit. Equal care, not a
 * squished desktop.
 */
import { useRef, useState } from "react";
import { LAYERS } from "@/app/lib/site.config";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";

/** The isometric plate stack. `active` lights one layer. */
function IsoStack({
  active,
  className = "",
}: {
  active: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 430"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {LAYERS.map((layer, i) => (
        <g
          key={layer.key}
          className={`iso-layer${i === active ? " is-active" : ""}`}
          transform={`translate(0 ${i * 64})`}
        >
          <path
            className="iso-plate"
            d="M180 8 L326 81 L180 154 L34 81 Z"
            strokeWidth="1.25"
          />
          <text
            className="iso-tag font-mono-num"
            x="10"
            y="86"
            fontSize="10"
            letterSpacing="1.5"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Intersection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // null = undecided (SSR renders the stacked fallback), then JS picks a mode.
  const [pinned, setPinned] = useState<boolean | null>(null);

  useGSAP(
    () => {
      registerGsap();
      const usePin =
        !prefersReducedMotion() &&
        window.matchMedia("(min-width: 1024px)").matches;
      setPinned(usePin);
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!pinned) return;
      const stage = stageRef.current;
      if (!stage) return;

      let current = 0;
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: `+=${LAYERS.length * 90}%`,
        pin: true,
        onUpdate: (self) => {
          const next = Math.min(
            LAYERS.length - 1,
            Math.floor(self.progress * LAYERS.length),
          );
          if (next !== current) {
            current = next;
            setActive(next);
            // Crisp text swap: out fast, in on the functional ease.
            if (textRef.current) {
              gsap.fromTo(
                textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.32, ease: "prod" },
              );
            }
          }
        },
      });
      return () => st.kill();
    },
    { scope: rootRef, dependencies: [pinned] },
  );

  const layer = LAYERS[active];

  return (
    <section
      id="intersection"
      ref={rootRef}
      aria-label="The intersection - five layers of one system"
      className="relative"
    >
      {pinned ? (
        /* ---------- DESKTOP: pinned scrub ---------- */
        <div ref={stageRef} className="flex h-screen items-center px-6">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-2 items-center gap-16">
            <div>
              <p className="tel-label mb-6">The intersection</p>
              <IsoStack active={active} className="w-full max-w-[400px]" />
            </div>
            <div>
              <p className="font-mono-num text-xs text-[var(--faint)]">
                {String(active + 1).padStart(2, "0")} / 05
              </p>
              <div ref={textRef} className="mt-4">
                <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  {layer.title}
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--muted)]">
                  {layer.line}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---------- MOBILE / REDUCED MOTION: vertical layer sequence ------- */
        <div className="px-6 py-10">
          <p className="tel-label mx-auto mb-2 max-w-5xl">The intersection</p>
          {LAYERS.map((l, i) => (
            <div
              key={l.key}
              className="mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-center py-10"
            >
              <IsoStack active={i} className="w-full max-w-[240px]" />
              <p className="font-mono-num mt-6 text-xs text-[var(--faint)]">
                {String(i + 1).padStart(2, "0")} / 05
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                {l.title}
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--muted)]">
                {l.line}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
