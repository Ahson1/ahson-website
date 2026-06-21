import CustomCursor from "@/app/components/CustomCursor";
import DepthGauge from "@/app/components/DepthGauge";
import DiveScrubber from "@/app/components/DiveScrubber";
import Loader from "@/app/components/Loader";
import SiteContent from "@/app/components/SiteContent";
import SiteNav from "@/app/components/SiteNav";

/**
 * Home
 * ----------------------------------------------------------------------------
 * Composition only. The cinematic dive (a self-contained client engine) opens
 * the page and dissolves onto the solid underwater blue; SiteContent picks up
 * on that same blue. The two are deliberately decoupled: the dive can later be
 * wrapped in site chrome without touching its scrub logic.
 *
 * The GSAP layer (loader wipe, custom cursor) rides on top as self-contained
 * client pieces, each with its own reduced-motion / pointer gating.
 */
export default function Home() {
  return (
    <>
      {/* Logo-wipe loader: holds while heavy assets preload, then reveals. */}
      <Loader />
      {/* Site chrome: stays hidden through the dive, slides in past the hero. */}
      <SiteNav />
      <DiveScrubber />
      <SiteContent />
      {/* Fixed instrumentation: tracks scroll depth across the whole page. */}
      <DepthGauge />
      {/* quickTo cursor + magnetic CTAs, gated behind (pointer: fine). */}
      <CustomCursor />
    </>
  );
}
