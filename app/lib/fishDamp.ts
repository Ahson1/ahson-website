/* motion: gsap-motion */
/**
 * fishDamp - shared particle-damping signal.
 * ---------------------------------------------------------------------------
 * The drifting DepthFish layer and the UnderwaterBackdrop mote field occupy
 * the same deep water, so when fish are passing through a zone we thin the
 * particles out a touch rather than let the two effects fight for the same
 * moment (per the build brief).
 *
 * DepthFish writes `value` (1 = full particle field, <1 = thinned) as fish
 * zones toggle on/off; UnderwaterBackdrop reads it once per frame and eases
 * toward it inside its existing rAF loop. A plain module-level ref keeps this
 * coordination off the React render path and avoids any per-frame DOM reads.
 */
export const fishDamp = { value: 1 };
