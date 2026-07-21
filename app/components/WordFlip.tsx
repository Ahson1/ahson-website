"use client";

/**
 * WordFlip - the hero's kinetic rotating domain word.
 * ----------------------------------------------------------------------------
 * Cycles through DOMAINS (site.config - PLACEHOLDER list). One word visible at
 * a time inside a masked inline-grid; the outgoing word lifts, the incoming
 * rises, on the expressive flow ease. Under reduced motion the first word sits
 * static (comprehension survives; the sentence still reads).
 */
import { useEffect, useRef, useState } from "react";
import { DOMAINS } from "@/app/lib/site.config";
import { gsap, registerGsap, prefersReducedMotion } from "@/app/lib/gsap";

const HOLD_MS = 2200;

export default function WordFlip() {
  const [index, setIndex] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    registerGsap();
    reduced.current = prefersReducedMotion();
    if (reduced.current) return;

    const id = window.setInterval(() => {
      const el = spanRef.current;
      if (!el) return;
      // Lift the current word out, swap text at the midpoint, rise back in.
      gsap.to(el, {
        yPercent: -105,
        opacity: 0,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          setIndex((i) => (i + 1) % DOMAINS.length);
          gsap.fromTo(
            el,
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.45, ease: "flowx" },
          );
        },
      });
    }, HOLD_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="wordflip" aria-live="off">
      <span ref={spanRef}>{DOMAINS[index]}</span>
    </span>
  );
}
