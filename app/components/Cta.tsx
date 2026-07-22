/**
 * Cta - the close. The particle field has just settled into the "ai" mark
 * above this section; the mark repeats here small, tying the morph's landing
 * to the studio pitch. One accent CTA + one quiet contact action.
 */
import AiMark from "@/app/components/AiMark";
import ContactButton from "@/app/components/ContactButton";
import CornerFrame from "@/app/components/CornerFrame";
import { STUDIO_URL } from "@/app/lib/site.config";

export default function Cta() {
  return (
    <section id="contact" className="px-6 py-24 sm:py-32">
      <div className="frame is-live mx-auto max-w-5xl px-6 py-14 text-center sm:px-10 sm:py-20">
        <CornerFrame />
        {/* The live "ai" mark, blinking: the morph above has just settled into
            this shape, so the CTA carries it in brand colours. */}
        <AiMark className="mx-auto h-12 w-auto [--ai-glow:5px]" />
        <h2 className="mx-auto mt-8 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
          Want a site like this?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          I design high-impact cinematic sites that carry a story, under
          ahson.studio.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={STUDIO_URL} data-magnetic className="btn-accent">
            ahson.studio <span aria-hidden>&rarr;</span>
          </a>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
