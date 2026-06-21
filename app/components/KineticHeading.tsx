/* motion: gsap-motion */
"use client";

/**
 * KineticHeading (Tier 1) - SplitText hero type.
 * ---------------------------------------------------------------------------
 * Renders a real <h1> (text ships in the HTML for SEO and reduced motion), then
 * splits it into masked characters that settle downward on "flow" when the line
 * scrolls into view. `autoSplit` re-splits on resize and the tween is created in
 * `onSplit`, so words never break mid-character and nothing wraps oddly.
 *
 * Reduced motion leaves the static heading untouched.
 */
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";

export default function KineticHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      let played = false;
      const split = SplitText.create(el, {
        type: "words,chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          if (played) {
            gsap.set(self.chars, { yPercent: 0, autoAlpha: 1 });
            return undefined;
          }
          return gsap.from(self.chars, {
            yPercent: -120,
            autoAlpha: 0,
            duration: 0.8,
            ease: "flow",
            stagger: 0.025,
            onComplete: () => {
              played = true;
            },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
