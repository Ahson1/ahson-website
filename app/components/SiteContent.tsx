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

/**
 * PROOF - the credibility section. Short, concrete, operator-led. Frames
 * healthcare as the domain where the discipline was learned, not the whole
 * identity. Each line is a plain statement of what was actually done.
 */
const PROOF: string[] = [
  "Led AI receptionist work at HealthEngine, live in real GP clinics, not a pilot.",
  "Built and shipped AI across voice, SMS, handoff, and operational tooling.",
  "Worked across general practice, radiology, allied health, and clinical operations.",
  "Brings a product and operator lens to AI systems: design, evaluation, and shipping, not just prototypes.",
];

/**
 * CAPABILITIES - what I build, framed to broaden beyond healthcare. Healthcare
 * is the strongest example, not the boundary. Each is a capability with one
 * line of concrete support.
 */
const CAPABILITIES: { title: string; body: string }[] = [
  {
    title: "Voice agents",
    body: "Phone and SMS systems that answer, book, reschedule, and hand off to a human cleanly.",
  },
  {
    title: "Workflow automation",
    body: "Operational flows that absorb edge cases and interruptions instead of breaking on them.",
  },
  {
    title: "Internal tools",
    body: "Admin and reviewer tooling so teams can see, trust, and steer what the AI is doing.",
  },
  {
    title: "Evaluation systems",
    body: "Measuring quality honestly, with call review and version tracking, before trusting a model with more.",
  },
  {
    title: "AI product strategy",
    body: "Deciding what to build, what to automate, and when, with a clear path from prototype to production.",
  },
  {
    title: "Prototype to production",
    body: "Taking AI from a working demo to a system that survives real, high-trust operations.",
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
          I build AI systems for messy real-world workflows.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          AI product operator and technical founder. I design, build, and ship
          AI systems for complex, high-trust workflows.
        </p>

        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Deep healthcare experience, now applied across industries where the
          work is operational, regulated, and unforgiving.
        </p>

        <div className="mt-10">
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-[var(--accent-strong)] hover:-translate-y-0.5"
          >
            Discuss an AI workflow
          </a>
        </div>
      </section>

      {/* EXPERIENCE STRIP - the quiet row of places I have built. A credibility
          line in the Sunlight zone that leads from the hero into Selected Work. */}
      <ExperienceStrip />

      {/*
        ====================================================================
        PROOF  (Sunlight) - credibility, early. Healthcare framed as the place
        the discipline was learned, not the whole identity. Lead line broadens
        it back out; the dotted list keeps the proof concrete and scannable.
        ====================================================================
      */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Built for trust, not demos.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Healthcare is where I learned to build AI for trust, edge cases, and
          operational complexity. I now apply that same discipline to AI systems
          across complex, high-trust workflows.
        </p>

        <ul className="mt-10 space-y-5">
          {PROOF.map((line) => (
            <li
              key={line}
              className="flex gap-3.5 text-base leading-relaxed text-[var(--muted)]"
            >
              <span
                aria-hidden
                className="mt-2.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
              />
              <span className="max-w-xl">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/*
        ====================================================================
        SELECTED WORK  (~Sunlight / upper Twilight) - the centerpiece.
        Project, the org it ran in, what it did in the real world, and a
        quiet metric line. Hairline-separated, no boxed cards, no icons -
        the org companion + metric line set it apart from "How I build".
        ====================================================================
      */}
      <section
        id="work"
        className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32"
      >
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
        WHAT I BUILD  (upper Twilight) - capability framing. Placed AFTER the
        healthcare-heavy proof so it explicitly broadens the work back out:
        healthcare is the strongest example, not the boundary. Two-column on
        desktop, single column on mobile; quiet, scannable, no icons.
        ====================================================================
      */}
      <section
        id="what-i-build"
        className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32"
      >
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          What I build
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          AI systems for the messy middle, from strategy through to production.
          Healthcare is the strongest example, not the boundary.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <div key={c.title}>
              <h3 className="flex items-center gap-2.5 text-lg font-medium leading-snug tracking-tight text-[var(--foreground)]">
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                />
                {c.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                {c.body}
              </p>
            </div>
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
      <section
        id="how-i-build"
        className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32"
      >
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
              Capabilities move faster than roadmaps. I keep the hard parts in
              the data, the workflow, and the trust, with model-agnostic
              architecture underneath, so the model can be swapped for a better
              one without a rewrite.
            </p>
          </div>

          <div className="border-t border-[var(--hairline)] py-8">
            <p className="text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
              Earn trust before you automate.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              In high-trust workflows, a confident wrong answer is worse than no
              answer. I ship assistance first, track prompts and versions,
              review real calls and outputs, and only hand over control once
              evaluation says it has earned the seat.
            </p>
          </div>

          <div className="border-t border-[var(--hairline)] py-8">
            <p className="text-xl font-medium leading-snug text-[var(--foreground)] sm:text-2xl">
              Ship into the mess, not the demo.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              Real operations have interruptions, accents, missing fields,
              handoffs, and edge cases that never appear in a polished demo. I
              design for admin, clinician, customer, and internal-user workflows
              from day one, because that is the only place the work actually has
              to hold.
            </p>
          </div>
        </div>
      </section>

      {/*
        ====================================================================
        CURRENT FOCUS  (~Twilight / Midnight) - what I'm building right now.
        Introduces Accelevate without making the whole site healthcare-only:
        healthcare is named as the initial wedge, then the framing widens to
        any workflow that has to hold under real conditions.
        ====================================================================
      */}
      <section
        id="current-focus"
        className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32"
      >
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Current focus
        </h2>

        <div className="mt-8 max-w-xl space-y-6">
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            I&rsquo;m building{" "}
            <span className="text-[var(--foreground)]">Accelevate</span>:
            evaluation-first AI agents and workflow systems. The work is voice
            AI, operational automation, and tooling for AI that can be reviewed,
            trusted, and improved over time.
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            Healthcare is the initial wedge, because it is complex, regulated,
            and operationally unforgiving. The same systems generalise to any
            workflow that has to hold under real conditions.
          </p>
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
            I&rsquo;m an AI product operator and technical founder in Sydney,
            around ten years across healthcare technology and production AI, with
            a biomedical engineering background. I built Helen at HealthEngine,
            was founding PM at Avoca, and now run Accelevate. I care about AI that
            survives contact with real operations, not AI that looks good in a
            demo.
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
          If you are building an AI product, automating a complex workflow, or
          trying to get AI from demo to production, I would like to hear about
          it.
        </p>

        <div className="mt-10">
          <a
            href="mailto:hello@ahsonkamal.com"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-[var(--accent-strong)] hover:-translate-y-0.5"
          >
            Talk to me about an AI product
          </a>
        </div>

        {/* CURRENTLY - a quiet line of presence, not a status badge. */}
        <p className="mt-16 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Currently building{" "}
          <span className="text-[var(--foreground)]">Accelevate</span>,
          evaluation-first voice AI and workflow automation, and writing about
          building AI systems that can be trusted in production.
        </p>
      </section>
      </div>
    </main>
  );
}
