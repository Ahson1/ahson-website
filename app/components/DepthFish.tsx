/* motion: gsap-motion */
"use client";

/**
 * DepthFish - drifting depth-fish background layer.
 * ---------------------------------------------------------------------------
 * A sparse set of transparent painted fish that drift through the deep water
 * BEHIND all content (above the UnderwaterBackdrop, below the z-10 content).
 * One depth-appropriate fish per zone - never a parade:
 *
 *   chromis    -> Sunlight   (#work)
 *   tang       -> Twilight   (#how-i-build)
 *   jelly      -> Midnight   (#current-focus)
 *   anglerfish -> Abyss      (#contact)
 *
 * Each fish:
 *   - drifts horizontally on its own slow, looping tween (translateX) with a
 *     subtle vertical bob (translateY), varied direction / speed / offset so
 *     it reads as drifting past, not marching;
 *   - is tied to its zone by a ScrollTrigger: fades in on enter, out on leave,
 *     and parallaxes on translateY via a separate scrub trigger;
 *   - pauses its loops off-screen (onToggle) so nothing animates unseen.
 *
 * Coordination: while an upper-zone fish is on screen we lower `fishDamp` so
 * the backdrop's mote field thins out and the two effects don't compete.
 *
 * Only transform + opacity animate. prefers-reduced-motion: the layer is left
 * hidden (CSS display:none + this effect early-returns), no motion at all.
 *
 * Assets are alpha cutout PNGs in /assets/fish (see the manifest there). A
 * missing file simply hides that one fish (onError) - the layer degrades to
 * nothing rather than showing a broken image, so the build stays clean.
 */

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";
import { fishDamp } from "@/app/lib/fishDamp";

type Fish = {
  key: string;
  src: string;
  alt: string;
  /** Zone anchor selector this fish lives in. */
  trigger: string;
  /** Resting position within the fixed viewport layer. */
  top: string;
  left: string;
  /** Responsive art width. */
  width: string;
  /** Mirror the art horizontally (cheap direction variety). */
  flip: boolean;
  /** Peak opacity while the zone is on screen (kept low - it's the deep). */
  opacity: number;
  /** Horizontal drift sweep, in vw, from x0 -> x1 (yoyo). */
  x0: number;
  x1: number;
  driftDur: number;
  /** Vertical bob amplitude (px) + period (s). */
  bobY: number;
  bobDur: number;
  /** Scrub parallax half-range on translateY (px): +parY -> -parY. */
  parY: number;
  /** Particle field multiplier while this fish is active (1 = no change). */
  damp: number;
};

// Four fish, one per zone - deliberately a handful. Upper zones (where the
// mote field is densest) damp particles harder; the deep is already sparse.
const FISH: Fish[] = [
  {
    key: "chromis",
    src: "/fish/chromis.png",
    alt: "",
    trigger: "#work",
    top: "30%",
    left: "2%",
    width: "clamp(78px, 8.5vw, 140px)",
    flip: false,
    opacity: 0.42,
    x0: -6,
    x1: 10,
    driftDur: 26,
    bobY: 9,
    bobDur: 6.5,
    parY: 60,
    damp: 0.4,
  },
  {
    key: "tang",
    src: "/fish/tang.png",
    alt: "",
    trigger: "#how-i-build",
    top: "58%",
    left: "80%",
    width: "clamp(70px, 7.5vw, 120px)",
    flip: true,
    opacity: 0.38,
    x0: 8,
    x1: -8,
    driftDur: 30,
    bobY: 8,
    bobDur: 7,
    parY: 70,
    damp: 0.5,
  },
  {
    key: "jelly",
    src: "/fish/jelly.png",
    alt: "",
    trigger: "#current-focus",
    top: "38%",
    left: "74%",
    width: "clamp(62px, 7vw, 108px)",
    flip: false,
    opacity: 0.4,
    x0: 4,
    x1: -6,
    driftDur: 34,
    bobY: 14, // jelly pulses vertically more than it swims
    bobDur: 5.5,
    parY: 80,
    damp: 0.7,
  },
  {
    key: "anglerfish",
    src: "/fish/angler.png",
    alt: "",
    trigger: "#contact",
    top: "46%",
    left: "5%",
    width: "clamp(84px, 9.5vw, 158px)",
    flip: false,
    opacity: 0.34,
    x0: -5,
    x1: 7,
    driftDur: 40,
    bobY: 6,
    bobDur: 8,
    parY: 60,
    damp: 0.85,
  },
];

export default function DepthFish() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      if (!root) return;

      // Reduced motion: render nothing in motion. The CSS also hides the layer
      // (display:none), so this is belt-and-braces - we simply never animate.
      if (prefersReducedMotion()) return;

      const vw = () => window.innerWidth / 100;

      // Particle damping: track the active fish and feed the strongest damp to
      // the shared signal the backdrop reads each frame.
      const activeDamp = new Map<string, number>();
      const recomputeDamp = () => {
        let v = 1;
        activeDamp.forEach((d) => {
          if (d < v) v = d;
        });
        fishDamp.value = v;
      };

      const cleanups: Array<() => void> = [];

      const nodes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".df-fish"));

      nodes.forEach((fishEl) => {
        const key = fishEl.dataset.key;
        const f = FISH.find((x) => x.key === key);
        if (!f) return;

        const trig = document.querySelector(f.trigger);
        if (!trig) return; // zone anchor not in the DOM -> skip this fish

        const move = fishEl.querySelector<HTMLElement>(".df-move");
        if (!move) return;

        // Start hidden; the visibility trigger fades it in on zone enter.
        gsap.set(fishEl, { opacity: 0 });

        // Looping horizontal drift (transform only), paused until on screen.
        const drift = gsap.fromTo(
          move,
          { x: f.x0 * vw() },
          {
            x: f.x1 * vw(),
            duration: f.driftDur,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
          },
        );

        // Subtle vertical bob on the same element (different property, so it
        // never fights the drift), also paused until on screen.
        const bob = gsap.to(move, {
          y: f.bobY,
          duration: f.bobDur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });

        // Gentle scrub parallax on the OUTER element's translateY, so bob and
        // parallax own separate transform targets and coexist cleanly.
        const parallax = gsap.fromTo(
          fishEl,
          { y: f.parY },
          {
            y: -f.parY,
            ease: "none",
            scrollTrigger: {
              trigger: trig,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Visibility: fade in on enter, out on leave; pause loops off-screen
        // and update the particle-damping signal.
        const vis = ScrollTrigger.create({
          trigger: trig,
          start: "top 80%",
          end: "bottom 20%",
          onToggle: (self) => {
            const on = self.isActive;
            if (on) {
              drift.play();
              bob.play();
            } else {
              drift.pause();
              bob.pause();
            }
            gsap.to(fishEl, {
              opacity: on ? f.opacity : 0,
              duration: 0.8,
              ease: "power2.out",
            });
            if (f.damp < 1) {
              if (on) activeDamp.set(f.key, f.damp);
              else activeDamp.delete(f.key);
              recomputeDamp();
            }
          },
        });

        cleanups.push(() => {
          drift.kill();
          bob.kill();
          parallax.scrollTrigger?.kill();
          parallax.kill();
          vis.kill();
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
        fishDamp.value = 1;
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="depthfish" aria-hidden="true">
      {FISH.map((f) => (
        <div
          key={f.key}
          data-key={f.key}
          className="df-fish"
          style={{ top: f.top, left: f.left, width: f.width }}
        >
          <div className="df-move">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.src}
              alt={f.alt}
              className="df-art"
              style={f.flip ? { transform: "scaleX(-1)" } : undefined}
              decoding="async"
              draggable={false}
              onError={(e) => {
                // Missing asset -> hide just this fish, never a broken image.
                const el = e.currentTarget.closest<HTMLElement>(".df-fish");
                if (el) el.style.display = "none";
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
