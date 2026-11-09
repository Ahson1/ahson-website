import type { Metadata } from "next";
import AmbientField from "@/app/components/AmbientField";
import AiMark from "@/app/components/AiMark";
import CornerFrame from "@/app/components/CornerFrame";
import Footer from "@/app/components/Footer";
import LinkedInIcon from "@/app/components/LinkedInIcon";
import { LINKEDIN_URL } from "@/app/lib/site.config";

/**
 * /projects - personal builds, one section each.
 * ----------------------------------------------------------------------------
 * Same Instrument system as the homepage: navy field, off-white text, hairline
 * frames, one cyan accent. Each project gets a lead line, a flow diagram of how
 * it works, three plain facts and real images of the thing itself.
 *
 * Copy guardrails (same as site.config): resume-fact only, no em dashes, no
 * employer or client data. Images are my own work: the VR room rendered from
 * its own code, the vault map drawn from the vault's own embeddings (no note
 * titles), and real rows from the YT Triage database.
 */

export const metadata: Metadata = {
  title: "Projects | Ahson Kamal",
  description:
    "Personal builds made with coding agents: a VR flight sim of Sydney, a searchable knowledge vault, a VR room for rehearsing talks, and a YouTube triage tool.",
};

type Step = { label: string; detail?: string };

function Flow({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0">
      {steps.map((s, i) => (
        <li key={s.label} className="flex flex-col sm:flex-row sm:items-center">
          <div className="rounded-sm border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] px-3.5 py-2.5">
            <p className="text-sm font-medium text-[var(--fg)]">{s.label}</p>
            {s.detail ? (
              <p className="mt-0.5 text-xs text-[var(--muted)]">{s.detail}</p>
            ) : null}
          </div>
          {i < steps.length - 1 ? (
            <span
              aria-hidden
              className="self-center px-2 py-1 font-mono text-[var(--accent)] sm:py-0"
            >
              <span className="sm:hidden">&darr;</span>
              <span className="hidden sm:inline">&rarr;</span>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure>
      <div className="frame overflow-hidden">
        <CornerFrame />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-[var(--faint)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Project({
  index,
  id,
  name,
  title,
  lead,
  when,
  stack,
  flow,
  points,
  children,
}: {
  index: string;
  id: string;
  name: string;
  title: string;
  lead: string;
  when: string;
  stack: string;
  flow: Step[];
  points: string[];
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="ticks mb-10" aria-hidden />
        <p className="tel-label">
          {index} &middot; {name}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          {lead}
        </p>
        <p className="mt-4 font-mono text-xs tracking-wide text-[var(--faint)]">
          {when} &middot; {stack}
        </p>

        <div className="mt-10">
          <p className="tel-label mb-3">How it works</p>
          <Flow steps={flow} />
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {points.map((p) => (
            <li
              key={p}
              className="border-l border-[var(--accent-dim)] pl-4 text-[15px] leading-relaxed text-[var(--fg)]/90"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

type Shot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

type LogStep = {
  title: string;
  body: string;
  shots?: Shot[];
  /** Real values from the headset's performance log (trimmed), shown as a mono block. */
  log?: string[];
};

/**
 * The build story for one project: numbered steps, each with a short
 * explanation and, where there is one, a before/after pair of real frames.
 */
function BuildLog({ steps }: { steps: LogStep[] }) {
  return (
    <div className="mt-16">
      <p className="tel-label mb-8">How it came together</p>
      <ol className="grid gap-12">
        {steps.map((s, i) => (
          <li key={s.title} className="grid gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                {s.body}
              </p>
            </div>
            {s.shots ? (
              <div
                className={
                  "grid gap-6 sm:grid-cols-2 " +
                  (s.shots[0].height > s.shots[0].width ? "max-w-2xl" : "")
                }
              >
                {s.shots.map((f) => (
                  <Figure key={f.src} {...f} />
                ))}
              </div>
            ) : null}
            {s.log ? (
              <div className="frame overflow-x-auto px-4 py-4 sm:px-5">
                <CornerFrame />
                <pre className="font-mono text-xs leading-relaxed text-[var(--muted)]">
                  {s.log.join("\n")}
                </pre>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

const FLIGHT_SIM_LOG: LogStep[] = [
  {
    title: "Read the plane straight from X-Plane",
    body: "X-Plane keeps its aircraft in its own text format, with each moving part tied to a cockpit control or gauge. The first render came out inside out: X-Plane orders the corners of its triangles the opposite way to Three.js, so every surface faced backwards until the order was flipped.",
  },
  {
    title: "Sharp on a screen, blurry in the headset",
    body: "On the headset the scenery never sharpened. Logs sent back from the Quest showed tiles stopped downloading the moment VR started: the Quest pauses the page's normal frame timer during VR, and the tile streamer was scheduled on it. I reproduced it on my Mac with Meta's WebXR emulator, then moved tile loading onto the headset's own frame loop.",
    shots: [
      {
        src: "/projects/flight-vr-before.webp",
        width: 631,
        height: 867,
        alt: "Headset view behind the plane over Bondi, with blurry, blocky scenery and a smeared slab of low-detail ground.",
        caption: "Before: stuck on the coarse tiles loaded before VR started.",
      },
      {
        src: "/projects/flight-vr-after.webp",
        width: 631,
        height: 867,
        alt: "The same headset view with sharp coastline, suburbs and a rock reef in the water.",
        caption: "After: the same view once tiles load in VR. Both frames from Meta's WebXR emulator.",
      },
    ],
  },
  {
    title: "Squares in the harbour",
    body: "Google photographs neighbouring patches of water on different days, so some arrive with sun glare or haze baked in and the harbour looks like a patchwork. Water is now picked out by its height and flatness and drawn in one consistent colour, keeping a little of the photo up close for reefs and shallows.",
    shots: [
      {
        src: "/projects/flight-water-before.webp",
        width: 1200,
        height: 675,
        alt: "Sydney Harbour from above Mosman with obvious dark and turquoise rectangular patches in the water.",
        caption: "Before: the photo water as delivered, in patches.",
      },
      {
        src: "/projects/flight-water-after.webp",
        width: 1200,
        height: 675,
        alt: "The same view with the harbour in one consistent dark blue, with ripples.",
        caption: "After: one surface, with ripples and sky reflection.",
      },
    ],
  },
  {
    title: "Tuned from the headset's own numbers",
    body: "Every ten seconds the headset reports its frame rate, draw calls and loaded tiles back to my Mac. Those numbers showed early flights running well below the Quest's 72 frames a second on the High setting, so scenery detail now adjusts itself to hold the frame rate.",
    log: [
      "perf[VR]: 19 fps · 258 calls · 534k tris · tiles 87 vis · 450MB · high",
      "perf[VR]: 34 fps · 456 calls · 839k tris · tiles 137 vis · 452MB · high",
    ],
  },
];

/** Real rows from the YT Triage Notion database (Oct 2026 snapshot). */
const TRIAGE_ROWS = [
  {
    title: "Claude Design Just Unlocked AI Motion Graphics",
    channel: "Futurepedia",
    verdict: "Watch",
    clickbait: 2,
    mins: 16.2,
  },
  {
    title: "Phone calls with Grok Bot",
    channel: "Matt Palmer",
    verdict: "Watch",
    clickbait: 2,
    mins: 6.6,
  },
  {
    title: "I Gave Claude Code Control of My TV",
    channel: "Lukas Margerie",
    verdict: "Skim",
    clickbait: 4,
    mins: 12.5,
  },
  {
    title: "SteamOS on Android is actually insane",
    channel: "Snowball",
    verdict: "Skim",
    clickbait: 3,
    mins: 12.5,
  },
];

function TriageTable() {
  return (
    <figure>
      <div className="frame overflow-x-auto px-4 py-5 sm:px-6">
        <CornerFrame />
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="tel-label">
              <th className="pb-3 font-normal">Video</th>
              <th className="pb-3 font-normal">Verdict</th>
              <th className="pb-3 font-normal">Clickbait</th>
              <th className="pb-3 text-right font-normal">Length</th>
            </tr>
          </thead>
          <tbody>
            {TRIAGE_ROWS.map((r) => (
              <tr key={r.title} className="border-t border-[var(--hairline)]">
                <td className="py-3 pr-4">
                  <p className="text-[var(--fg)]">{r.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--faint)]">
                    {r.channel}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={
                      "rounded-sm border px-2 py-0.5 font-mono text-xs " +
                      (r.verdict === "Watch"
                        ? "border-[var(--accent-dim)] text-[var(--accent)]"
                        : "border-[var(--hairline)] text-[var(--muted)]")
                    }
                  >
                    {r.verdict}
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-[var(--muted)]">
                  <span aria-label={`${r.clickbait} out of 5`}>
                    {"●".repeat(r.clickbait)}
                    <span className="text-[var(--hairline)]">
                      {"●".repeat(5 - r.clickbait)}
                    </span>
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-xs text-[var(--muted)]">
                  {r.mins.toFixed(1)} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-[var(--faint)]">
        Four real rows from the Notion database. Each row opens to the full
        summary.
      </figcaption>
    </figure>
  );
}

export default function Projects() {
  return (
    <>
      <AmbientField />

      <header className="border-b border-[var(--hairline)] bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-md">
        <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 sm:h-16 sm:px-8">
          <a
            href="/"
            className="flex items-center gap-3 text-sm font-medium tracking-tight text-[var(--fg)] transition-opacity duration-200 hover:opacity-70"
          >
            <AiMark className="h-[18px] w-auto [--ai-glow:2px]" />
            <span>Ahson Kamal</span>
          </a>
          <div className="flex items-center gap-5 sm:gap-7">
            <a
              href="/"
              className="text-sm text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]"
            >
              Home
            </a>
            <a
              href="/#contact"
              className="text-sm text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
            >
              Contact
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
      </header>

      <main className="relative">
        <section className="px-6 pb-4 pt-20 sm:pt-28">
          <div className="mx-auto max-w-5xl">
            <p className="tel-label">Projects</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight sm:text-6xl">
              Things I build for myself.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Personal tools, built with coding agents in my own time. Each one
              started with a problem I had.
            </p>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {[
                ["#flight-sim", "01 Sydney VR flight sim"],
                ["#cerebrum", "02 Cerebrum"],
                ["#rehearsal", "03 VR rehearsal room"],
                ["#yt-triage", "04 YT Triage"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Project
          index="01"
          id="flight-sim"
          name="Sydney VR flight sim"
          title="A flight sim of Sydney that runs on a Quest 2"
          lead="A Cirrus SR22 I fly around Sydney Harbour, Bondi and the Northern Beaches on a Meta Quest 2, over Google's photorealistic 3D city, reaching out to grab the stick and throttle."
          when="November 2026"
          stack="Three.js, WebXR, Google Photorealistic 3D Tiles, X-Plane 12 aircraft files"
          flow={[
            { label: "Google 3D Tiles", detail: "streamed as I fly" },
            { label: "X-Plane SR22", detail: "read from its own files" },
            { label: "Flight model", detail: "per surface, 120 Hz" },
            { label: "WebXR", detail: "in the Quest browser" },
            { label: "My hands", detail: "grab stick and throttle" },
          ]}
          points={[
            "The aircraft is the Cirrus SR22 from my own copy of X-Plane 12. A parser written for this reads X-Plane's model files directly, so the stick, throttle and flaps move with the controls and both Garmin screens show live flight data.",
            "Google's photorealistic 3D city streams in as I fly. A water shader finds the harbour and adds ripples, sky reflections and sun glitter, and ferries run the real routes from Circular Quay to Manly, Taronga and up the Parramatta River.",
            "The physics treats each wing panel, the tail, the propeller and each wheel separately, 120 times a second. Takeoffs start from real runway ends at Sydney Airport and Bankstown, and scenery detail eases off by itself when the frame rate drops.",
          ]}
        >
          <div className="grid gap-6">
            <Figure
              src="/projects/flight-cockpit.webp"
              width={1600}
              height={900}
              alt="The view from the pilot's seat of a Cirrus SR22 over Sydney Harbour, with the Garmin screens on the panel and the city skyline ahead."
              caption="Over the nose, heading up the harbour towards the city. Aircraft: Laminar Research's X-Plane 12 Cirrus SR22, loaded from my own copy for personal use and not distributed. Scenery: Google Maps."
            />
            <div className="grid gap-6 sm:grid-cols-3">
              <Figure
                src="/projects/flight-harbour.webp"
                width={1600}
                height={900}
                alt="Chase view behind the plane over the harbour, with the Harbour Bridge, Opera House and city skyline ahead."
                caption="West of the Bridge."
              />
              <Figure
                src="/projects/flight-bondi.webp"
                width={1600}
                height={900}
                alt="Chase view behind the plane off Bondi, with the beach on the left and open ocean on the right."
                caption="Off Bondi."
              />
              <Figure
                src="/projects/flight-manly.webp"
                width={1600}
                height={900}
                alt="Chase view behind the plane over Manly, heading up the Northern Beaches coastline."
                caption="Manly, heading up the Northern Beaches."
              />
            </div>
          </div>
          <BuildLog steps={FLIGHT_SIM_LOG} />
        </Project>

        <Project
          index="02"
          id="cerebrum"
          name="Cerebrum"
          title="A second brain that knows when it doesn't know"
          lead="My notes from business books and courses, kept as a vault of short notes and searchable by meaning from Claude or ChatGPT, on my laptop or my phone."
          when="2026, in daily use"
          stack="Obsidian, embeddings, MCP, Cloudflare Workers, D1, Vectorize"
          flow={[
            { label: "Notes", detail: "Obsidian vault" },
            { label: "Embeddings", detail: "title, body, topic" },
            { label: "Vector index", detail: "5,177 notes" },
            { label: "Search", detail: "with a confidence floor" },
            { label: "Claude or ChatGPT", detail: "over MCP" },
          ]}
          points={[
            "Every note is embedded and searched by meaning through an MCP server, so Claude and ChatGPT can both pull from it mid-conversation.",
            "Below a similarity floor it says the vault doesn't cover the question, instead of answering from weak matches. Knowing when not to answer is the same rule I apply to production AI.",
            "Runs locally on my Mac and as a hosted copy on Cloudflare, so it works from my phone with the laptop closed.",
          ]}
        >
          <Figure
            src="/projects/cerebrum-map.webp"
            width={1800}
            height={1013}
            alt="A map of about five thousand dots on a dark background, grouped into clusters by topic, with faint lines between clusters."
            caption="The vault itself: each dot is one of 5,177 notes, placed by meaning (a 2D projection of its embeddings) and coloured by topic. Faint lines join notes to their nearest neighbours in other topics. No note titles shown."
          />
        </Project>

        <Project
          index="03"
          id="rehearsal"
          name="VR rehearsal room"
          title="A room to practise a talk in before giving it"
          lead="A 48-seat replica of a workshop room I was preparing to speak in, running in the browser on a Meta Quest, with my own deck on the screen and an audience that reacts."
          when="October 2026"
          stack="Three.js, WebXR, Blender, Whisper"
          flow={[
            { label: "My deck", detail: "slides, builds, notes" },
            { label: "WebXR room", detail: "on the Quest" },
            { label: "Rehearse", detail: "recorded" },
            { label: "Transcript", detail: "Whisper" },
            { label: "Report", detail: "pace, fillers, timing" },
          ]}
          points={[
            "Built with Three.js and WebXR and served from my Mac to the headset. The real deck runs on the screen, including each slide's animation builds, driven from the controllers.",
            "The audience can be 12 to 48 people and attentive, neutral or restless: people check phones, drift, nod and cough. Seated characters were converted from Mixamo with a scripted Blender pipeline.",
            "A confidence monitor at my feet shows notes and a timer against the plan. Each run is recorded, transcribed and scored for pace, filler words and time per slide.",
          ]}
        >
          <div className="grid gap-6">
            <Figure
              src="/projects/vr-speaker-view.webp"
              width={1600}
              height={900}
              alt="The view from the speaker's spot: rows of seated audience members in a conference room, with a confidence monitor showing notes and a timer in the foreground."
              caption="The speaker's view, with the confidence monitor at the bottom. Rendered from the app's own code."
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Figure
                src="/projects/vr-room.webp"
                width={1600}
                height={900}
                alt="The room from the back row: the audience facing a projector screen showing a slide."
              />
              <Figure
                src="/projects/vr-monitor.webp"
                width={1440}
                height={810}
                alt="Close-up of the confidence monitor: slide number, elapsed time, time against plan and speaker notes."
              />
            </div>
          </div>
        </Project>

        <Project
          index="04"
          id="yt-triage"
          name="YT Triage"
          title="Decide whether a video is worth it before watching it"
          lead="Share a YouTube video from my phone and a summary with a Watch, Skim or Skip verdict lands in Notion, before I commit the time to watch it."
          when="March 2026 onwards, in daily use"
          stack="Android, Termux, Python, Claude, Notion API"
          flow={[
            { label: "Share", detail: "from any Android app" },
            { label: "Termux script", detail: "Python" },
            { label: "Transcript", detail: "pulled, chunked" },
            { label: "Claude", detail: "summary + verdict" },
            { label: "Notion", detail: "one row per video" },
          ]}
          points={[
            "The Android share sheet hands the link to a Python script in Termux on the phone, which pulls the transcript and sends it to Claude.",
            "Claude writes the summary in a format that suits the kind of video, such as a tutorial, opinion or review, and scores how clickbait the title is from 1 to 5.",
            "More than 220 videos triaged so far, at around half a US cent each. Built on the phone itself over one session, then refined as I used it.",
          ]}
        >
          <TriageTable />
        </Project>

        <section className="px-6 pb-24 pt-8">
          <div className="mx-auto max-w-5xl">
            <div className="ticks mb-10" aria-hidden />
            <p className="max-w-2xl text-[var(--muted)]">
              My professional work, from healthcare voice AI to government
              integrations, is on the{" "}
              <a
                href="/"
                className="text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
              >
                home page
              </a>
              .
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
