/* motion: gsap-motion */
"use client";

/**
 * Loader (Tier 1) - the logo wipe.
 * ---------------------------------------------------------------------------
 * Full-bleed, off-black tinted to the page hue, sitting above everything. It
 * holds on the glowing "a" mark while the two heaviest first-paint assets
 * preload (dive frame 0 and the fish poster), then exits: the mark lifts on
 * "snap", the panel wipes on "flow", and anything tagged [data-enter] rises in.
 *
 * Scroll is locked and reset to the surface while it holds, so the dive always
 * begins at frame 0. Reduced motion skips the timeline and reveals statically.
 */
import { useRef, useState } from "react";
import AiMark from "@/app/components/AiMark";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      if (!root) return;

      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = "hidden";
      window.scrollTo(0, 0);

      const finish = () => {
        html.style.overflow = prevOverflow;
        setHidden(true);
        ScrollTrigger.refresh();
      };

      if (prefersReducedMotion()) {
        const id = window.setTimeout(finish, 200);
        return () => {
          window.clearTimeout(id);
          html.style.overflow = prevOverflow;
        };
      }

      gsap.set(root, { clipPath: "inset(0 0 0% 0)" });

      let killed = false;
      const preload = Promise.all([
        loadImage("/frames/dive/0001.webp"),
        loadImage("/assets/painted/fish-school-poster.jpg"),
      ]).catch(() => null);

      Promise.race([
        Promise.all([preload, wait(600)]),
        wait(2600), // safety: never trap the visitor behind a slow asset
      ]).then(() => {
        if (killed) return;
        const enter = gsap.utils.toArray<HTMLElement>("[data-enter]");
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(markRef.current, {
          yPercent: -120,
          autoAlpha: 0,
          duration: 0.6,
          ease: "snap",
        });
        tl.to(
          root,
          { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "flow" },
          "-=0.15",
        );
        if (enter.length) {
          tl.from(
            enter,
            {
              yPercent: 40,
              autoAlpha: 0,
              duration: 0.7,
              ease: "flow",
              stagger: 0.08,
            },
            "-=0.4",
          );
        }
      });

      return () => {
        killed = true;
        html.style.overflow = prevOverflow;
      };
    },
    { scope: rootRef },
  );

  if (hidden) return null;

  return (
    <div ref={rootRef} className="loader" aria-hidden="true">
      <div ref={markRef} className="loader-mark">
        {/* Inline SVG "ai" mark: transparent, so it sits on the loader's navy
            with no box edge, and the cursor blinks while the assets preload. */}
        <AiMark />
      </div>
    </div>
  );
}
