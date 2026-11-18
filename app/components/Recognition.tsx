/**
 * Recognition - the awards photo plus speaking. Static, no particle moment:
 * one photo, one credential, a short dated list. Content lives in
 * site.config.ts (RECOGNITION) so new talks are a one-line edit.
 */
import CornerFrame from "@/app/components/CornerFrame";
import { RECOGNITION } from "@/app/lib/site.config";

export default function Recognition() {
  const { award, photo, speaking } = RECOGNITION;
  return (
    <section id="recognition" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="tel-label mb-6">Recognition / speaking</h2>
        <div className="frame relative px-6 py-10 sm:px-10 sm:py-12">
          <CornerFrame />
          <div className="relative grid items-center gap-10 sm:grid-cols-[minmax(0,280px)_1fr] sm:gap-14">
            <figure className="mx-auto w-full max-w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-sm border border-[var(--hairline)]"
              />
            </figure>

            <div>
              <p className="tel-label">{award.event}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-4xl">
                {award.title}
              </h3>
              <p className="mt-3 text-lg text-[var(--muted)]">
                {award.category}
              </p>

              <ul className="mt-10 border-t border-[var(--hairline)]">
                {speaking.map((s) => (
                  <li
                    key={s.title}
                    className="flex flex-col gap-1 border-b border-[var(--hairline)] py-5 sm:flex-row sm:gap-8"
                  >
                    <span className="tel-label shrink-0 pt-1 sm:w-28">
                      {s.date}
                    </span>
                    <span>
                      <span className="block text-base text-[var(--fg)]">
                        {s.title}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {s.where}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
