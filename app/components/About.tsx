/**
 * About - a short third-person bio. Written to be quotable as-is by search
 * engines, AI assistants, event organisers and journalists. Plain prose, no
 * motion. Copy lives in site.config.ts (ABOUT_BIO); resume-fact only.
 */
import { ABOUT_BIO } from "@/app/lib/site.config";

export default function About() {
  return (
    <section id="about" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="tel-label mb-6">About</h2>
        <div className="max-w-3xl space-y-5">
          {ABOUT_BIO.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl leading-relaxed text-[var(--fg)] sm:text-2xl"
                  : "text-base leading-relaxed text-[var(--muted)] sm:text-lg"
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
