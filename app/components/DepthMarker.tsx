/**
 * DepthMarker
 * ----------------------------------------------------------------------------
 * A restrained marker for the depth descent. The deepening background does the
 * real work; this is an optional, quiet label - a real ocean-zone name and a
 * faint depth readout - for sections that want one. It is deliberately NOT a
 * numbered eyebrow, and not every section should use it.
 *
 * Usage: <DepthMarker zone="Sunlight" depth="0-200 m" />
 */

type DepthMarkerProps = {
  /** Real ocean-zone name: Sunlight, Twilight, Midnight, Abyss. */
  zone: string;
  /** Optional faint depth readout, e.g. "0-200 m". */
  depth?: string;
};

export default function DepthMarker({ zone, depth }: DepthMarkerProps) {
  return (
    <div className="mb-8 flex items-center gap-3 text-[var(--muted)]">
      <span
        aria-hidden="true"
        className="h-7 w-px"
        style={{ background: "var(--accent)", opacity: 0.5 }}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-[0.22em]">{zone}</span>
        {depth ? (
          <span className="font-mono text-[11px] tracking-tight opacity-60">
            {depth}
          </span>
        ) : null}
      </div>
    </div>
  );
}
