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
 *  2. DOMAINS             -> hero word-flip list (finalize wording here)
 *  3. LOGOS               -> public/assets/logos/*.svg  (grey labelled boxes
 *                            now; drop real SVGs at the SAME filenames, then
 *                            update `fact` hover lines here)
 *  4. GLYPHS              -> public/assets/glyphs/{voice,rag,agents,design}.svg
 *                            (monoline placeholders; real glyphs at the same
 *                            filenames re-feed the particle sampler untouched)
 *  5. AI_MARK             -> public/assets/brand/ai-mark.svg (studio "ai"
 *                            logo; final morph target + CTA mark)
 *
 * GUARDRAILS: every copy string below is resume-fact only. No employer-internal
 * client metrics (containment %, per-clinic call volumes, clinic counts tied to
 * a named employer product). Keep Accelevate low-profile.
 */

/** 2. HERO WORD-FLIP - the rotating domain list. PLACEHOLDER: finalize. */
export const DOMAINS: string[] = [
  "radiology",
  "clinics",
  "allied health",
  "marketplaces",
  "high-stakes ops",
];

/** 3. LOGO STRIP - employer logos + one resume-fact hover line each.
 *  PLACEHOLDER: grey labelled boxes; swap SVGs in place, rewrite `fact`s. */
export type LogoSlot = { name: string; src: string; fact: string };
export const LOGOS: LogoSlot[] = [
  {
    name: "HealthEngine",
    src: "/assets/logos/healthengine.svg",
    fact: "Australia's first AI virtual receptionist — 0→1",
  },
  {
    name: "Avoca",
    src: "/assets/logos/avoca.svg",
    fact: "Founding PM — real-time radiology voice AI",
  },
  {
    name: "Logo slot 03",
    src: "/assets/logos/logo-03.svg",
    fact: "Placeholder fact line — swap with a résumé fact",
  },
  {
    name: "Logo slot 04",
    src: "/assets/logos/logo-04.svg",
    fact: "Placeholder fact line — swap with a résumé fact",
  },
  {
    name: "Logo slot 05",
    src: "/assets/logos/logo-05.svg",
    fact: "Placeholder fact line — swap with a résumé fact",
  },
  {
    name: "Logo slot 06",
    src: "/assets/logos/logo-06.svg",
    fact: "Placeholder fact line — swap with a résumé fact",
  },
];

/** PROOF ROW - the approved safe stat set (mono numerals, odometer). */
export type Stat = { value: string; label: string };
export const STATS: Stat[] = [
  { value: "10", label: "years healthtech AI" },
  { value: "200+", label: "practices" },
  { value: "0→1", label: "AI receptionists" },
  { value: "1", label: "full voice stack, built solo" },
  { value: "100+", label: "user interviews" },
  { value: "1/25", label: "deployed internationally" },
];

/** THE INTERSECTION - 5 layers, one concrete proof line each. */
export type Layer = { key: string; title: string; line: string };
export const LAYERS: Layer[] = [
  {
    key: "business",
    title: "Business & GTM",
    line: "Modelled the unit economics behind enterprise AI pricing; cold-acquired the first 15 pilot clinics.",
  },
  {
    key: "product",
    title: "Product",
    line: "AI receptionists 0→1; 30+ discovery interviews into a shipped MVP.",
  },
  {
    key: "technical",
    title: "Technical",
    line: "Full real-time voice AI stack, built solo; 1,000+ government test cases.",
  },
  {
    key: "ai",
    title: "AI",
    line: "LLM-as-judge eval harnesses + RAG with auditability; 24-scenario, 4-judge suite.",
  },
  {
    key: "design",
    title: "Design",
    line: "The site you're on.",
  },
];

/** 4./5. CAPABILITY GLYPHS - the particle-morph sequence, in order. The final
 *  state is the studio "ai" mark and leads into the CTA. PLACEHOLDER SVGs;
 *  swap files in place (white strokes on transparent - the sampler reads
 *  alpha). design.svg is a reserved contract slot, not in the morph. */
export type Glyph = { key: string; src: string; label: string };
export const MORPH_GLYPHS: Glyph[] = [
  { key: "voice", src: "/assets/glyphs/voice.svg", label: "Voice AI, end to end" },
  { key: "rag", src: "/assets/glyphs/rag.svg", label: "Retrieval with auditability" },
  { key: "agents", src: "/assets/glyphs/agents.svg", label: "Agentic systems that hold" },
  { key: "ai-mark", src: "/assets/brand/ai-mark.svg", label: "ahson.studio" },
];

/** 5. The studio mark on its own (CTA, footer). */
export const AI_MARK_SRC = "/assets/brand/ai-mark.svg";

/** Coordinates - real, Sydney. */
export const COORDS = "33.8688° S, 151.2093° E";

/** Contact + links. */
export const CONTACT_EMAIL = "hello@ahson.com.au";
export const STUDIO_URL = "https://ahson.studio";
export const SELECTED_WORK: {
  name: string;
  status: string;
  body: string;
  href?: string;
}[] = [
  {
    name: "Locum Motion",
    status: "Live",
    body: "A marketplace matching GP locums to clinics, with booking automation underneath. Co-founded.",
    href: "https://locummotion.com.au",
  },
  // Room to add more later - keep this list short on purpose.
];
