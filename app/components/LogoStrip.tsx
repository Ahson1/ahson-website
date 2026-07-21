/**
 * LogoStrip - "Companies I've worked with."
 * ----------------------------------------------------------------------------
 * External proof, placed high (right under the hero handoff). A slow marquee
 * of employer logos; hovering (or focusing) a logo pauses the strip and
 * reveals ONE resume-fact line beneath it.
 *
 * PLACEHOLDER CONTRACT SLOT 3: logos + fact lines live in site.config LOGOS;
 * grey labelled boxes now, real SVGs at the same filenames tomorrow.
 *
 * Marquee + hover are pure CSS (globals.css .marquee / .logo-cell) so this
 * stays a server component. Under reduced motion the track simply doesn't
 * animate; every logo is still reachable by keyboard focus.
 */
import { LOGOS } from "@/app/lib/site.config";

function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-start" aria-hidden={ariaHidden}>
      {LOGOS.map((logo) => (
        <div
          key={logo.name + (ariaHidden ? "-dup" : "")}
          className="logo-cell group flex w-[180px] flex-col items-center gap-3 px-5 sm:w-[220px] sm:px-7"
          tabIndex={ariaHidden ? -1 : 0}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={ariaHidden ? "" : logo.name}
            className="h-10 w-auto sm:h-12"
            loading="lazy"
          />
          <p className="logo-fact min-h-[2.5em] text-center text-xs leading-snug text-[var(--muted)]">
            {logo.fact}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LogoStrip() {
  return (
    <section aria-label="Companies I've worked with" className="py-14 sm:py-16">
      <p className="tel-label mb-8 text-center">Companies I&rsquo;ve worked with</p>
      <div className="marquee">
        <div className="marquee-track items-start">
          <LogoRow />
          {/* Second copy makes the -50% loop seamless. */}
          <LogoRow ariaHidden />
        </div>
      </div>
      <div className="ticks mx-auto mt-12 max-w-5xl px-6" />
    </section>
  );
}
