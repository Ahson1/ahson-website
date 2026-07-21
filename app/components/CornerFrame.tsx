/**
 * CornerFrame - completes the telemetry bracket set.
 * ----------------------------------------------------------------------------
 * `.frame` (globals.css) draws the top-left and bottom-right brackets with
 * pseudo-elements; this renders the other diagonal pair. Drop inside any
 * element that has className="frame".
 */
export default function CornerFrame() {
  return (
    <>
      <span aria-hidden className="frame-tr" />
      <span aria-hidden className="frame-bl" />
    </>
  );
}
