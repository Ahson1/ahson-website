import CapabilityMorph from "@/app/components/CapabilityMorph";
import Cta from "@/app/components/Cta";
import CustomCursor from "@/app/components/CustomCursor";
import DiveScrubber from "@/app/components/DiveScrubber";
import Footer from "@/app/components/Footer";
import Intersection from "@/app/components/Intersection";
import Loader from "@/app/components/Loader";
import LogoStrip from "@/app/components/LogoStrip";
import ProofRow from "@/app/components/ProofRow";
import SiteNav from "@/app/components/SiteNav";

/**
 * Home - the Instrument redesign.
 * ----------------------------------------------------------------------------
 * The cinematic dive hero (untouched engine, new title card) opens the page
 * and dissolves onto its deep-water blue; a short handoff band carries that
 * blue down into the off-black instrument field the rest of the site lives
 * on. Section order per the build brief:
 *   hero -> logo strip -> proof -> intersection -> what-i-build (morph) ->
 *   selected work -> CTA -> footer.
 */
export default function Home() {
  return (
    <>
      <Loader />
      <SiteNav />

      {/* 1. HERO - the existing dive scrub, with name / word-flip headline /
             coordinates / scroll signifier on the title card. */}
      <DiveScrubber />

      <main className="relative bg-[var(--bg)]">
        {/* Seamless handoff: deep-water blue -> instrument off-black. */}
        <div
          aria-hidden="true"
          className="h-[42vh]"
          style={{
            background:
              "linear-gradient(to bottom, var(--underwater-blue), var(--bg))",
          }}
        />

        {/* 2. LOGO STRIP - external proof, placed high. */}
        <LogoStrip />

        {/* 3. PROOF - odometer row. Particle moment #1 (subtle). */}
        <ProofRow />

        {/* 4. THE INTERSECTION - pinned isometric systems stack. */}
        <Intersection />

        {/* Selected work is intentionally absent from this build - ventures
               get a dedicated section later. */}

        {/* 5. WHAT I BUILD - particle moment #2 (signature): the emblem morph
               that settles into the "ai" mark and leads into the CTA. */}
        <CapabilityMorph />

        {/* 7. CTA - the close. */}
        <Cta />

        {/* 8. FOOTER */}
        <Footer />
      </main>

      {/* Cyan reticle cursor - desktop fine-pointer only. */}
      <CustomCursor />
    </>
  );
}
