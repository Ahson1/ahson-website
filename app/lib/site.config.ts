/**
 * SITE CONFIG - THE PLACEHOLDER CONTRACT
 * ----------------------------------------------------------------------------
 * Every swappable placeholder on the redesign lives HERE or in the asset slots
 * named here. Dropping in real assets tomorrow means editing THIS file and
 * replacing files in public/assets/ - no component refactor required.
 *
 * SLOTS:
 *  1. --accent            -> app/globals.css :root (one hex, sampled from the
 *                            real "ai" logo; everything cyan reads from it)
 *  2. LOGOS               -> public/assets/logos/*.svg  (grey labelled boxes
 *                            now; drop real SVGs at the SAME filenames, then
 *                            update `fact` hover lines here)
 *  3. GLYPHS              -> public/assets/glyphs/{voice,rag,agents}.svg
 *                            (monoline placeholders; real glyphs at the same
 *                            filenames re-feed the particle sampler untouched)
 *  4. AI_MARK             -> public/assets/brand/ai-mark.svg (REAL mark, traced
 *                            from the signature GIF's pixel grid; final morph
 *                            target. Inline animated version: AiMark.tsx)
 *  5. ARTIFACTS           -> public/assets/artifacts/*.svg (one faint artifact
 *                            per intersection plate; MY OWN WORK ONLY - own
 *                            architecture diagram, own eval UI. Never employer/client dashboards,
 *                            never real patient/client data.)
 *
 * GUARDRAILS: every copy string below is resume-fact only. No employer-internal
 * client metrics. No em dashes anywhere in copy. Keep Accelevate low-profile;
 * own ventures never appear in the employer logo strip.
 */

/** HERO - static headline + subline (the word-flip is gone). The headline is
 *  split so the lead clause renders bright and the qualifier renders in the
 *  muted accent tint - depth via weight/colour contrast, not a gradient. */
export const HERO_HEADLINE_LEAD =
  "Complex technical systems, built end to end";
export const HERO_HEADLINE_QUALIFIER = "in high-stakes environments.";
export const HERO_SUBLINE =
  "Product leader and technical founder. A decade in healthtech, now building agentic systems that hold up in production.";

/** 2. LOGO STRIP - former EMPLOYERS ONLY (no own ventures), one resume-fact
 *  hover line each. Real logos in place, normalised to white/mono (incubate is
 *  a PNG - no vector source exists). TBC fact lines are neutral descriptors;
 *  swap with resume facts. No employer-internal numbers in fact lines. */
export type LogoSlot = { name: string; src: string; fact: string };
export const LOGOS: LogoSlot[] = [
  {
    name: "Avoca",
    src: "/assets/logos/avoca.svg",
    fact: "Founding PM, enterprise radiology voice AI",
  },
  {
    name: "Next Practice",
    src: "/assets/logos/next-practice.svg",
    fact: "Developed the electronic health record from the ground up",
  },
  {
    name: "MedicalDirector",
    src: "/assets/logos/md.svg",
    fact: "Medicare Webservices rollout across practices",
  },
  {
    name: "Baraja",
    src: "/assets/logos/baraja.svg",
    fact: "Field application engineer, LiDAR for self-driving cars",
  },
  {
    name: "HealthEngine",
    src: "/assets/logos/healthengine.svg",
    fact: "Led the AI vertical; took an AI receptionist from pilot to national launch",
  },
  {
    name: "INCUBATE",
    src: "/assets/logos/incubate.png",
    fact: "Built a medical device in the startup accelerator",
  },
];

/** USYD sits with the hero credential line, not in the employer strip. */
export const CREDENTIAL_LOGO_SRC = "/assets/logos/usyd.svg";
export const CREDENTIAL = "B.Eng Biomedical, Mechanical major (Hons)";

/** PROOF ROW - the approved safe stat set (mono numerals, odometer).
 *  Final slot replaced 1/25; PLACEHOLDER (TBC): confirm the current clean
 *  stat, value must stay resume-fact only. */
export type Stat = { value: string; label: string };
export const STATS: Stat[] = [
  { value: "10", label: "years in healthtech" },
  { value: "200+", label: "practices reached" },
  { value: "100+", label: "clinical user interviews" },
  { value: "1,000+", label: "government test cases" },
];

/** THE INTERSECTION - 4 layers (Product, AI & Systems, Commercial, Design).
 *  Order matters: 01 renders on the TOP plate and reads sharpest. `artifact`
 *  is a faint own-work-only image on the layer's plane (slot 5 above). */
export type Layer = {
  key: string;
  title: string;
  line: string;
  skills: string[];
  artifact: string;
};
export const LAYERS: Layer[] = [
  {
    key: "product",
    title: "Product",
    line: "Turn ambiguous problems into a sharp product vision, grounded in hundreds of user interviews and proven through real-world behaviour.",
    skills: ["Discovery", "Product strategy", "Experimentation", "0→1 delivery"],
    artifact: "/assets/artifacts/product.svg",
  },
  {
    key: "ai-systems",
    title: "AI & Systems",
    line: "Build AI products people can trust, with transparent behaviour, rigorous evaluation, resilient system design and clear human oversight.",
    skills: [
      "Voice AI",
      "Agents and RAG",
      "Evals and observability",
      "Full-stack prototyping",
    ],
    artifact: "/assets/artifacts/ai-systems.svg",
  },
  {
    key: "commercial",
    title: "Commercial",
    line: "Turn product insight into a viable business: find the wedge, shape the offer, model the economics and win the first customers.",
    skills: ["Market positioning", "Pricing", "Pilot design", "Early-stage GTM"],
    artifact: "/assets/artifacts/commercial.svg",
  },
  {
    key: "design",
    title: "Design",
    line: "Translate complex workflows into clear, credible interfaces built around how people actually think, decide and work.",
    skills: ["UX structure", "Interaction design", "Visual systems", "Prototyping"],
    artifact: "/assets/artifacts/design.svg",
  },
];

/** 3./4. CAPABILITY GLYPHS - the particle-morph sequence, in order. The final
 *  state is the personal "ai" mark and leads into the CTA. PLACEHOLDER SVGs;
 *  swap files in place (white strokes on transparent - the sampler reads
 *  alpha). */
export type Glyph = { key: string; src: string; label: string };
export const MORPH_GLYPHS: Glyph[] = [
  { key: "voice", src: "/assets/glyphs/voice.svg", label: "Voice AI, end to end" },
  { key: "rag", src: "/assets/glyphs/rag.svg", label: "Retrieval with auditability" },
  { key: "agents", src: "/assets/glyphs/agents.svg", label: "Agentic systems that hold" },
  { key: "ai-mark", src: "/assets/brand/ai-mark.svg", label: "Ahson Kamal" },
];

/** 4. The "ai" mark on its own (CTA, nav). */
export const AI_MARK_SRC = "/assets/brand/ai-mark.svg";

/** Coordinates - real, Sydney. */
export const COORDS = "33.8688° S, 151.2093° E";

/** Contact + links. */
export const CONTACT_EMAIL = "ahson@ahson.com.au";
export const SITE_URL = "https://ahson.com.au";
export const LINKEDIN_URL = "https://www.linkedin.com/in/ahsonkamal";

/* SELECTED WORK is intentionally absent from this build: ventures (Locum
   Motion, Accelevate) get a dedicated section later, and never appear in the
   employer logo strip above. */

/** RECOGNITION - awards photo + speaking list (Recognition.tsx). Newest
 *  first. Public facts only. */
export const RECOGNITION = {
  award: {
    event: "Australian AI Awards 2026",
    title: "Finalist",
    category: "AI Leader of the Year (SME)",
  },
  photo: {
    src: "/assets/recognition/ahson-kamal-australian-ai-awards-2026.jpg",
    alt: "Ahson Kamal holding his finalist trophy at the Australian AI Awards 2026 in Sydney",
    width: 900,
    height: 1350,
  },
  speaking: [
    {
      date: "25 Nov 2026",
      title: "Beyond the Demo: Building AI Agents You Can Trust",
      where: "Tech Talk, FACTS Summit, ICC Sydney",
    },
    {
      date: "2 Jul 2026",
      title: "Panel speaker",
      where: "HealthHaus Sydney",
    },
  ],
};
export const OG_IMAGE = "/assets/recognition/og-ahson-kamal.jpg";

/** SEARCH - one source of truth for the title, description and the Person
 *  structured data in app/layout.tsx. Resume-fact only, same guardrails as the
 *  copy above. Add worksFor / more sameAs links here when ready. */
export const SEO_TITLE =
  "Ahson Kamal | Technical founder and product leader, Sydney";
export const SEO_DESCRIPTION =
  "Ahson Kamal is a Sydney technical founder and product leader. A decade in Australian healthtech, now building voice AI and agentic systems that hold up in production. Finalist, AI Leader of the Year (SME), Australian AI Awards 2026.";
export const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahson Kamal",
  url: SITE_URL,
  image: `${SITE_URL}${RECOGNITION.photo.src}`,
  email: `mailto:${CONTACT_EMAIL}`,
  jobTitle: "Technical founder and product leader",
  description: SEO_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    addressCountry: "AU",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Sydney",
  },
  award: "Finalist, AI Leader of the Year (SME), Australian AI Awards 2026",
  knowsAbout: [
    "Voice AI",
    "Agentic systems",
    "Retrieval-augmented generation",
    "AI evaluation",
    "Healthcare technology",
    "Product management",
  ],
  sameAs: [LINKEDIN_URL],
};
