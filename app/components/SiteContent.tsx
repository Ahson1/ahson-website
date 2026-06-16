import DepthMarker from "@/app/components/DepthMarker";
import ExperienceStrip from "@/app/components/ExperienceStrip";
import SeaGallery from "@/app/components/SeaGallery";
import TheTurn from "@/app/components/TheTurn";
import UnderwaterBackdrop from "@/app/components/UnderwaterBackdrop";

/**
 * SiteContent
 * ----------------------------------------------------------------------------
 * Everything after the dive lands here. The dive canvas dissolves onto
 * --underwater-blue, which is exactly --depth-sunlight (the top of the descent
 * gradient below), so there is no seam: the page IS the continuation of the
 * dive.
 *
 * DEPTH DESCENT: <main> carries a vertical gradient keyed to real scroll
 * distance in PIXELS (not section count). On this short first pass you only
 * sink into the upper water; as real sections are added and the page grows,
 * deeper zones (midnight, abyss) reveal themselves naturally. The deepening is
 * the carrier - zone labels are optional and sparing (see DepthMarker).
 *
 * This pass ships ONE coherent placeholder section so the page is navigable.
 * Real sections slot into the marked seams without touching the dive engine.
 */

/**
 * SELECTED WORK - the centerpiece. Each entry is a project (with the org it ran
 * in, when that differs from the project name), a plain-English account of what
 * it actually did in the real world, and a quiet metric line whose numbers I
 * drop in later. `metric` lists the stat NAMES on purpose - they are honest
 * placeholders, not invented figures. Edit/reorder freely.
 */
const WORK: {
  project: string;
  org?: string;
  body: string;
  metric: string;
}[] = [
  {
    project: "Helen",
    org: "HealthEngine",
    body: "Australia's first AI receptionist for GP clinics. I built it to answer calls, book appointments, and handle routine requests so front desks could stop drowning in the phone queue, and it went live in real practices with real patients, not a pilot.",
    metric: "clinics live · calls handled · booking rate",
  },
  {
    project: "Radiology Voice AI",
    org: "Avoca",
    body: "Founding PM for a voice receptionist that rolled out across 140+ radiology clinics. I owned it from the first messy calls to a containment-focused booking agent that held up against accents, interruptions, and the real way people book scans.",
    metric: "containment rate · monthly call volume",
  },
  {
    project: "Accelevate",
    body: "What I'm building now: AI voice and SMS for allied health clinics, psychology, OT, and physio. Missed-call text-back plus a receptionist that books, reschedules, and follows up, so a two-room practice gets front-desk coverage it could never afford to staff.",
    metric: "clinics live · early results",
  },
  {
    project: "Locum Motion",
    body: "A marketplace matching GP locums to clinics, with the Accelevate receptionist stack underneath so cover requests and bookings handle themselves. Co-founded, currently in early sales.",
    metric: "stage · traction",
  },
];

export default function SiteContent() {
  return (
    <main
      className="relative"
      style={{
        background:
          "linear-gradient(to bottom," +
          " var(--depth-sunlight) 0px," +
          " var(--depth-twilight) 1200px," +
          " var(--depth-midnight) 2700px," +
          " var(--depth-abyss) 4200px)",
      }}
    >
      {/* Living water: caustics, light shafts, particle drift + dither. Sits
          behind everything; intensity is tied to scroll depth. */}
      <UnderwaterBackdrop />

      {/* All page content rides ABOVE the water layers. */}
      <div className="relative z-10">
        {/*
        ====================================================================
        FUTURE SEAM: VOICE-AI HERO  (Sunlight zone, just below the surface)
        Mounts here, immediately after the handoff, on the same water.
        ====================================================================
      */}

      {/* A short beat of pure blue (pt-[18vh]) so the dive resolves into deep
          water, then the headline lands - not a full empty viewport. */}
      <section className="mx-auto flex min-h-[82dvh] w-full max-w-3xl flex-col justify-start px-6 pb-24 pt-[18vh] sm:px-8">
        <DepthMarker zone="Sunlight" depth="0-200 m" />

        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
          I build AI systems for messy healthcare workflows.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Solo technical founder. I design, build, and ship clinical tooling
          that holds up against the real-world mess of how care actually gets
          delivered.
        </p>

        <div className="mt-10">
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-[var(--accent-strong)] hover:-translate-y-0.5"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* EXPERIENCE STRIP - the quiet row of places I have built. A credibility
          line in the Sunlight zone that leads from the hero into Selected Work. */}
      <ExperienceStrip />

      {/*
        ====================================================================
        SELECTED WORK  (~Sunlight / upper Twilight) - the centerpiece.
        Project, the org it ran in, what it did in the real world, and a
        quiet metric line. Hairline-separated, no boxed cards, no icons -
        the org companion + metric line set it apart from "How I build".
        ====================================================================
      */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32">
        {/* No zone label here: the hero already marks Sunlight and "How I build"
            marks Twilight. Selected Work rides the transition between them, so a
            third marker would only announce what the deepening already says. */}
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Selected work
        </h2>

        <div className="mt-12">
          {WORK.map((w, i) => (
            <article
              key={w.project}
              className={
                "py-10" +
                (i === 0 ? "" : " border-t border-[var(--hairline)]")
              }
            >
              <h3 className="text-xl font-medium leading-snug tracking-tight text-[var(--foreground)] sm:text-2xl">
                {w.project}
                {w.org ? (
                  <span className="font-normal text-[var(--muted)]">
                    , {w.org}
                  </span>
                ) : null}
              </h3>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
                {w.body}
              </p>

              {/* Metric line: stat NAMES, numbers dropped in later. The single
                  amber dot ties it to the one accent and reads as "outcomes",
                  not a boxed stat card. */}
              <p className="mt-5 flex items-center gap-2.5 text-sm text-[var(--muted)]">
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                />
                {w.metric}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/*
        ====================================================================
        HOW I BUILD  (Twilight zone)
        Three stacked convictions, separated by hairlines. Not boxed cards,
        no icons - each is a lead statement with a quiet line of support.
        ====================================================================
      */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32">
        <DepthMarker zone="Twilight" depth="200-1000 m" />

        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          How I build
        </h2>

        <div className="mt-12">
          <div className="py-8">
            <p className="text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
              Build for the model that&rsquo;s coming, not the one in front of
              you.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              Capabilities move faster than roadmaps. I design systems whose
              hard parts are the data, the workflow, and the trust, so the model
              underneath can be swapped for a better one without a rewrite.
            </p>
          </div>

          <div className="border-t border-[var(--hairline)] py-8">
            <p className="text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
              Earn trust before you automate.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              In clinical settings, a wrong answer delivered confidently is
              worse than no answer. I ship assistance first, measure it
              honestly, and only hand over control once the evidence says it has
              earned the seat.
            </p>
          </div>

          <div className="border-t border-[var(--hairline)] py-8">
            <p className="text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
              Ship into the mess, not the demo.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              Real clinics have interruptions, accents, missing fields, and
              edge cases that never appear in a polished demo. I build against
              that reality from day one, because that is the only place the work
              actually has to hold.
            </p>
          </div>
        </div>
      </section>

      {/*
        ====================================================================
        ABOUT  (~Midnight) - the person behind the work, set deep in the
        descent. Quiet prose, no marker (Contact carries the Midnight label
        just below). The closing line names the dive itself - the page sinks
        because that is what he does, which earns the whole conceit.
        ====================================================================
      */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          About
        </h2>

        <div className="mt-8 max-w-xl space-y-6">
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            I&rsquo;m a solo technical founder in Sydney, around ten years across
            healthcare technology and production AI, biomedical engineering
            background. I built Helen at HealthEngine and was founding PM at
            Avoca before starting Accelevate. I care about tooling that survives
            contact with a real clinic, not tooling that looks good in a demo.
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            When I&rsquo;m not building, I&rsquo;m usually in the water or under
            the sky, freediving and shooting the ocean and the stars around
            Sydney. That&rsquo;s roughly why this site sinks the way it does.
          </p>
        </div>
      </section>

      {/*
        ====================================================================
        IN THE WATER  (Midnight) - the interests gallery. The deepest, darkest
        water is where the sea life lives; a horizontal row of clips rides here
        before the descent bottoms out. Full-bleed scroller, no column.
        ====================================================================
      */}
      <SeaGallery />

      {/*
        ====================================================================
        THE TURN  (Abyss -> cosmos) - the water runs out and opens to stars.
        Full-bleed, unmarked: this is the payoff, not another zone. It dissolves
        the deep water into night just before the contact close.
        ====================================================================
      */}
      <TheTurn />

      {/*
        ====================================================================
        FUTURE SEAMS (~Twilight / Midnight, would slot ABOVE the deep zone):
          - LABS
          - WRITING
        Each is an independent <section>. No engine changes.
        ====================================================================
      */}

      {/*
        ====================================================================
        CONTACT  (Midnight zone; deepest stop on this pass)
        Wires the #contact anchor from the hero CTA.
        ====================================================================
      */}
      <section
        id="contact"
        className="mx-auto flex min-h-[80dvh] w-full max-w-3xl flex-col justify-center px-6 py-24 sm:px-8"
      >
        <DepthMarker zone="Midnight" depth="1000-4000 m" />

        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Let&rsquo;s talk.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          If you are building clinical tooling, or buying it for a clinic, and
          you want it to survive contact with the real world, I would like to
          hear about it.
        </p>

        <div className="mt-10">
          <a
            href="mailto:hello@ahsonkamal.com"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-[var(--accent-strong)] hover:-translate-y-0.5"
          >
            Email me
          </a>
        </div>

        {/* CURRENTLY - a quiet line of presence, not a status badge. */}
        <p className="mt-16 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Currently building{" "}
          <span className="text-[var(--foreground)]">Accelevate</span>, AI voice
          and SMS for allied health clinics, and writing about
          evaluation-first voice AI.
        </p>
      </section>
      </div>
    </main>
  );
}
