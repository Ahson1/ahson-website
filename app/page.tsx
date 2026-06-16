import DepthGauge from "@/app/components/DepthGauge";
import DiveScrubber from "@/app/components/DiveScrubber";
import SiteContent from "@/app/components/SiteContent";

/**
 * Home
 * ----------------------------------------------------------------------------
 * Composition only. The cinematic dive (a self-contained client engine) opens
 * the page and dissolves onto the solid underwater blue; SiteContent picks up
 * on that same blue. The two are deliberately decoupled: the dive can later be
 * wrapped in site chrome without touching its scrub logic.
 */
export default function Home() {
  return (
    <>
      <DiveScrubber />
      <SiteContent />
      {/* Fixed instrumentation: tracks scroll depth across the whole page. */}
      <DepthGauge />
    </>
  );
}
