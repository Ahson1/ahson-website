/* motion: gsap-motion */
"use client";

/**
 * The Intersection - the centrepiece.
 * ----------------------------------------------------------------------------
 * A pinned isometric "systems stack": four layers that light up cyan one at a
 * time as the visitor scroll-scrubs through the section. Layer 01 (Product)
 * sits on the TOP plate and is painted LAST, so it renders sharpest and gets
 * seen first. Each plate carries a faint own-work artifact on its plane
 * (site.config LAYERS[].artifact - own diagrams/UI only, never employer or
 * client material); the active layer's artifact and plate light crisp + cyan.
 *
 * Desktop: ScrollTrigger pins the panel for 4 scrub segments.
 * Mobile / reduced motion: no pin - a vertical scroll-snap sequence of the
 * four layers (globals.css .snap-layer), each block showing the stack with
 * its own layer lit. Equal care, not a squished desktop.
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

/** The isometric plate stack. `active` lights one layer. Layers are painted
 *  in REVERSE index order so layer 01 (top plate) paints last = sharpest. */
function IsoStack({
  active,
  className = "",
}: {
  active: number;
  className?: string;
}) {
  const order = LAYERS.map((_, i) => i).reverse();
  return (
    <svg
      viewBox="0 0 360 366"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {order.map((i) => {
        const layer = LAYERS[i];
        return (
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
            {/* Faint own-work artifact, laid INTO the plate's plane. The
                matrix maps the unit square onto the diamond: origin = top
                vertex (180,8), x-axis = top->right edge (146,73), y-axis =
                top->left edge (-146,73). The image keeps its own aspect
                inside that square (meet), so it reads as a flat sheet
                resting on the plate. */}
            <g transform="matrix(146 73 -146 73 180 8)">
              <image
                className="iso-artifact"
                href={layer.artifact}
                x="0.06"
                y="0.06"
                width="0.88"
                height="0.88"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
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
        );
      })}
    </svg>
  );
}

/** The mono skill chips under a layer's line. */
function SkillChips({ skills }: { skills: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {skills.map((s) => (
        <li
          key={s}
          className="font-mono-num border border-[var(--hairline)] px-2.5 py-1 text-[11px] tracking-[0.06em] text-[var(--muted)]"
        >
          {s}
        </li>
      ))}
    </ul>
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
  const total = String(LAYERS.length).padStart(2, "0");

  return (
    <section
      id="intersection"
      ref={rootRef}
      aria-label="The intersection - four layers of one system"
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
                {String(active + 1).padStart(2, "0")} / {total}
              </p>
              <div ref={textRef} className="mt-4">
                <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  {layer.title}
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--muted)]">
                  {layer.line}
                </p>
                <SkillChips skills={layer.skills} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---------- MOBILE / REDUCED MOTION: vertical scroll-snap ---------- */
        <div className="px-6 py-10">
          <p className="tel-label mx-auto mb-2 max-w-5xl">The intersection</p>
          {LAYERS.map((l, i) => (
            <div
              key={l.key}
              className="snap-layer mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-center py-10"
            >
              <IsoStack active={i} className="w-full max-w-[240px]" />
              <p className="font-mono-num mt-6 text-xs text-[var(--faint)]">
                {String(i + 1).padStart(2, "0")} / {total}
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                {l.title}
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--muted)]">
                {l.line}
              </p>
              <SkillChips skills={l.skills} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
