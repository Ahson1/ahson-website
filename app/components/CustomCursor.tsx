/* motion: gsap-motion */
"use client";

/**
 * CustomCursor (Tier 1) - quickTo cursor + magnetic CTA.
 * ---------------------------------------------------------------------------
 * A soft ring trails the pointer on `quickTo` (transform only). Elements tagged
 * [data-magnetic] pull toward the pointer while hovered and the ring swells to
 * read as a target. Gated hard behind `(pointer: fine)` and reduced motion, so
 * touch devices and motion-sensitive visitors keep the native cursor and never
 * mount any of this.
 */
import { useRef, useState } from "react";
import { gsap, useGSAP, registerGsap, prefersReducedMotion } from "@/app/lib/gsap";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useGSAP(() => {
    registerGsap();

    const fine =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xRing(e.clientX);
      yRing(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2, ease: "snap" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "snap" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // Magnetic pull on CTAs.
    const magnets = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
    const cleanups: Array<() => void> = [];

    magnets.forEach((el) => {
      const strength = 0.35;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "snap" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "snap" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };
      const enter = () =>
        gsap.to(ring, { scale: 2.4, opacity: 0.65, duration: 0.3, ease: "snap" });
      const leave = () => {
        xTo(0);
        yTo(0);
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "snap" });
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cleanups.forEach((c) => c());
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
