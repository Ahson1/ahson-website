"use client";

/**
 * SiteNav
 * ----------------------------------------------------------------------------
 * A restrained top navigation that stays OUT of the cinematic dive. During the
 * hero the nav is hidden, so the dive title card and corner wordmark own the
 * frame uninterrupted. Once the visitor scrolls past the opening, the bar
 * slides down: wordmark on the left, a short set of section links on the right,
 * over a faint blur + hairline so it reads as quiet site chrome, not a banner.
 *
 * Restraint / consistency with the rest of the site:
 *  - No logo soup, no mega-menu. One wordmark, three links, one accent CTA.
 *  - Reveal is a single state flip across a scroll threshold (not per-frame
 *    React churn): a rAF-throttled scroll handler toggles a ref-guarded class.
 *  - Colours come from the same CSS variables as everything else.
 *  - Under prefers-reduced-motion the bar simply appears (no slide), and anchor
 *    jumps are instant rather than smooth-scrolled.
 */

import { useEffect, useRef, useState } from "react";
import AiMark from "@/app/components/AiMark";
import LinkedInIcon from "@/app/components/LinkedInIcon";
import { LINKEDIN_URL, STUDIO_URL } from "@/app/lib/site.config";

/** Section links, in page order. `cta` gets the accent treatment. */
const LINKS: { label: string; href: string; cta?: boolean; hideSm?: boolean }[] =
  [
    { label: "Proof", href: "#proof", hideSm: true },
    { label: "Systems", href: "#intersection" },
    { label: "Contact", href: "#contact", cta: true },
  ];

export default function SiteNav() {
  // `shown` controls the slide/fade. We flip it once per threshold crossing.
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let queued = false;

    // Reveal once past ~70% of the first viewport, so the dive hero is clear.
    const threshold = () => window.innerHeight * 0.7;

    const apply = () => {
      queued = false;
      const next = window.scrollY > threshold();
      if (next !== shownRef.current) {
        shownRef.current = next;
        setShown(next);
      }
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none " +
        (shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0")
      }
    >
      {/* Faint blur + hairline so the bar separates from content without a hard
          fill. The gradient keeps the left/right edges legible over any frame. */}
      <div className="border-b border-[var(--hairline)] bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-md">
        <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 sm:h-16 sm:px-8">
          {/* Logo: the animated "ai" mark + wordmark -> back to the top. The
              glow radius is a CSS px value, so it's dialled down to nav scale. */}
          <a
            href="#top"
            className="flex items-center gap-3 text-sm font-medium tracking-tight text-[var(--fg)] transition-opacity duration-200 hover:opacity-70"
          >
            <AiMark className="h-[18px] w-auto [--ai-glow:2px]" />
            <span>Ahson Kamal</span>
          </a>

          <div className="flex items-center gap-5 sm:gap-7">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={
                  "text-sm transition-colors duration-200 " +
                  (l.hideSm ? "hidden sm:inline " : "") +
                  (l.cta
                    ? "text-[var(--accent)] hover:opacity-80"
                    : "text-[var(--muted)] hover:text-[var(--fg)]")
                }
              >
                {l.label}
              </a>
            ))}

            {/* External presence: studio wordmark + LinkedIn glyph. */}
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)] sm:inline"
            >
              ahson.studio
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]"
            >
              <LinkedInIcon />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
