/**
 * ScrollCue - the unmistakable scroll signifier.
 * ----------------------------------------------------------------------------
 * Assumes a non-technical viewer who may not know the page scrolls: the word
 * SCROLL plus a down-arrow travelling a short track, centered at the bottom of
 * the hero. Pure CSS animation (globals.css), stilled under reduced motion
 * where the arrow simply rests on the track.
 */
export default function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center gap-3"
    >
      <span className="tel-label !text-[10px] text-white/70">Scroll</span>
      <div className="scrollcue-track">
        <svg
          className="scrollcue-arrow"
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="none"
        >
          <path
            d="M5 0v10M1 7l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
