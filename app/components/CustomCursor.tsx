/* motion: gsap-motion */
"use client";

/**
 * CustomCursor - the cyan crosshair reticle. DESKTOP ONLY.
 * ---------------------------------------------------------------------------
 * A corner-bracketed reticle trails the pointer (quickTo, transform-only) and
 * SNAPS to interactive elements: on hover of a link/button the reticle glides
 * to the element's center and scales to its bounds, reading as target lock.
 * A tight dot always marks the true pointer. [data-magnetic] elements also
 * pull toward the pointer.
 *
 * Hard-gated behind (pointer: fine) + reduced motion: touch devices keep
 * native tap/active states and never mount any of this.
 */
import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";

const RETICLE_BASE = 34; // px, matches .cursor-reticle
const SNAP_SELECTOR = "a, button, [data-magnetic], [data-cursor-snap]";

export default function CustomCursor() {
  const reticleRef = useRef<HTMLDivElement>(null);
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

    const reticle = reticleRef.current;
    const dot = dotRef.current;
    if (!reticle || !dot) return;

    const xRet = gsap.quickTo(reticle, "x", { duration: 0.4, ease: "power3" });
    const yRet = gsap.quickTo(reticle, "y", { duration: 0.4, ease: "power3" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });

    let snapTarget: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      if (snapTarget) {
        // Locked: track the element (it may be drifting magnetically).
        const r = snapTarget.getBoundingClientRect();
        xRet(r.left + r.width / 2);
        yRet(r.top + r.height / 2);
      } else {
        xRet(e.clientX);
        yRet(e.clientY);
      }
    };

    const lock = (el: HTMLElement) => {
      snapTarget = el;
      const r = el.getBoundingClientRect();
      const sx = Math.min(8, (r.width + 18) / RETICLE_BASE);
      const sy = Math.min(4, (r.height + 14) / RETICLE_BASE);
      xRet(r.left + r.width / 2);
      yRet(r.top + r.height / 2);
      gsap.to(reticle, {
        scaleX: sx,
        scaleY: sy,
        opacity: 0.9,
        duration: 0.28,
        ease: "prod",
      });
    };

    const release = () => {
      snapTarget = null;
      gsap.to(reticle, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.28,
        ease: "prod",
      });
    };

    // Delegated snap: works for every current and future interactive element.
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        SNAP_SELECTOR,
      );
      if (el && el !== snapTarget) lock(el);
    };
    const onOut = (e: PointerEvent) => {
      if (!snapTarget) return;
      const to = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>(
        SNAP_SELECTOR,
      );
      if (to !== snapTarget) {
        if (to) lock(to);
        else release();
      }
    };

    const onDown = () =>
      gsap.to(reticle, { scale: 0.88, duration: 0.15, ease: "prod" });
    const onUp = () =>
      gsap.to(reticle, { scale: 1, duration: 0.25, ease: "prod" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // Magnetic pull on tagged CTAs.
    const magnets = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
    const cleanups: Array<() => void> = [];
    magnets.forEach((el) => {
      const strength = 0.3;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "prod" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "prod" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cleanups.forEach((c) => c());
      document.documentElement.classList.remove("has-custom-cursor");
    };
    // Re-run once `enabled` mounts the reticle/dot into the DOM.
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={reticleRef} className="cursor-reticle" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
