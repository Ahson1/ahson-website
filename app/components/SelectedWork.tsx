/**
 * SelectedWork - kept deliberately LIGHT.
 * ----------------------------------------------------------------------------
 * A single minimal card for Locum Motion (live), with room to add more later
 * via site.config SELECTED_WORK. This section does not lead; capabilities do.
 */
import CornerFrame from "@/app/components/CornerFrame";
import { SELECTED_WORK } from "@/app/lib/site.config";

export default function SelectedWork() {
  return (
    <section id="work" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="tel-label mb-6">Selected work</p>
        <div className="space-y-6">
          {SELECTED_WORK.map((w) => (
            <article
              key={w.name}
              className="frame flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            >
              <CornerFrame />
              <div>
                <h2 className="flex items-center gap-3 text-xl font-medium tracking-tight sm:text-2xl">
                  {w.name}
                  <span className="flex items-center gap-1.5 text-xs font-normal text-[var(--accent)]">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                    />
                    {w.status}
                  </span>
                </h2>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-[var(--muted)]">
                  {w.body}
                </p>
              </div>
              {w.href ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-medium text-[var(--fg)] underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                >
                  Visit site <span aria-hidden>&rarr;</span>
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
