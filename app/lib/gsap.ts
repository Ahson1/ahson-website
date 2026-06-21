/* motion: gsap-motion */
"use client";

/**
 * Central GSAP setup for the site.
 * ---------------------------------------------------------------------------
 * Per the build brief we run ScrollTrigger ONLY (no global ScrollSmoother): the
 * site already owns its scroll feel through the hand-rolled dive engine, and we
 * are not gambling that for marginal page-wide inertia.
 *
 * Plugins are registered once, lazily, on the client. The two signature eases
 * the brief asks for, "flow" (soft, expo-like settle) and "snap" (a quick lift
 * with a hair of overshoot), are defined here so every component shares them.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);

  // Soft, expo-like settle. Used for the loader wipe and kinetic type.
  CustomEase.create("flow", "M0,0 C0.16,1 0.3,1 1,1");
  // Quick lift with a touch of overshoot. Used for the loader mark and CTAs.
  CustomEase.create("snap", "M0,0 C0.34,1.4 0.5,1 1,1");

  registered = true;
}

/** True when the visitor has asked for reduced motion. Safe on the server. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, useGSAP, ScrollTrigger, SplitText, CustomEase };
