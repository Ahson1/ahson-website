/**
 * Footer - Sydney, links, connect, studio cross-link. Quiet telemetry close.
 */
import { COORDS, CONTACT_EMAIL, STUDIO_URL } from "@/app/lib/site.config";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">Ahson Kamal</p>
          <p className="tel-label mt-2 normal-case !tracking-[0.14em]">
            Sydney &middot; {COORDS}
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[var(--muted)]"
        >
          <a
            className="transition-colors duration-200 hover:text-[var(--fg)]"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            Email
          </a>
          <a
            className="transition-colors duration-200 hover:text-[var(--fg)]"
            href="https://www.linkedin.com/in/ahsonkamal"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="transition-colors duration-200 hover:text-[var(--fg)]"
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            designed by ahson.studio
          </a>
        </nav>
      </div>
    </footer>
  );
}
