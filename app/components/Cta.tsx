/**
 * Cta - the close. The particle field has just settled into the "ai" mark
 * above this section; the mark repeats here small, tying the morph's landing
 * to the studio pitch. One accent CTA + one quiet contact action.
 */
import CornerFrame from "@/app/components/CornerFrame";
import { AI_MARK_SRC, CONTACT_EMAIL, STUDIO_URL } from "@/app/lib/site.config";

export default function Cta() {
  return (
    <section id="contact" className="px-6 py-24 sm:py-32">
      <div className="frame is-live mx-auto max-w-5xl px-6 py-14 text-center sm:px-10 sm:py-20">
        <CornerFrame />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AI_MARK_SRC}
          alt=""
          aria-hidden="true"
          className="mx-auto h-14 w-14 opacity-90"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(69%) sepia(61%) saturate(1900%) hue-rotate(165deg) brightness(103%)",
          }}
        />
        <h2 className="mx-auto mt-8 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
          Want a site like this?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          This site is one of mine. I design and build cinematic, precise sites
          under ahson.studio — and AI systems that hold up in production.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={STUDIO_URL} data-magnetic className="btn-accent">
            ahson.studio <span aria-hidden>&rarr;</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} data-magnetic className="btn-quiet">
            Let&rsquo;s talk
          </a>
        </div>
      </div>
    </section>
  );
}
