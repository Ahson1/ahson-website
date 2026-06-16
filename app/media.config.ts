/**
 * media.config.ts
 * ----------------------------------------------------------------------------
 * The single manifest for the interests gallery (sea life) and the ocean ->
 * cosmos turn. Adding a clip or still later is a ONE-LINE entry here; no
 * component changes. Files live in /public/media and are served from /media.
 *
 * Until a file exists, the components degrade gracefully: gallery cards fall
 * back to a deep-water placeholder + poster, and the turn falls back to a CSS
 * starfield. So the layout is never broken and the real assets just drop in.
 *
 * Captions are "subject, real location" - a quiet identity line, not a blurb.
 * Edit the [location] placeholders in place.
 */

export type GalleryItem = {
  /** Stable id, also the React key. */
  id: string;
  kind: "video" | "image";
  /** Primary file. MP4 for video, JPG/PNG for image. Served from /media. */
  src: string;
  /** Optional WebM sibling for video; used first when present. */
  webm?: string;
  /** Poster / still: the pre-play, reduced-motion and data-saver frame. */
  poster?: string;
  /** "Subject, Location" - one quiet line. */
  caption: string;
  /** Flip to false to keep an entry in the manifest but out of the row. */
  enabled: boolean;
};

/**
 * Gallery order = display order. To add one later, copy a line and point it at
 * a new file in /public/media. To temporarily hide one, set enabled: false.
 */
export const GALLERY: GalleryItem[] = [
  {
    id: "cuttle",
    kind: "video",
    src: "/media/cuttle.mp4",
    poster: "/media/cuttle-poster.jpg",
    caption: "Cuttlefish, Cabbage Tree Bay",
    enabled: true,
  },
  {
    id: "turtle",
    kind: "video",
    src: "/media/turtle.mp4",
    poster: "/media/turtle-poster.jpg",
    caption: "Green turtle, [location]",
    enabled: true,
  },
  // Kept for later - re-enable with no code change once the stills are in.
  {
    id: "whalebreach",
    kind: "image",
    src: "/media/whalebreach.jpg",
    caption: "Humpback breach, [location]",
    enabled: false,
  },
  {
    id: "operahouse",
    kind: "image",
    src: "/media/operahouse.jpg",
    caption: "Sydney Opera House, [location]",
    enabled: false,
  },
];

/** The ocean -> cosmos payoff. The photo layers over a CSS starfield base. */
export const COSMOS = {
  src: "/media/milkyway.jpg",
  caption: "Milky Way over [location]",
} as const;
