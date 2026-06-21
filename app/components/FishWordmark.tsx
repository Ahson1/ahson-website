/* motion: gsap-motion */
"use client";

/**
 * FishWordmark (the showpiece) - underwater masked wordmark.
 * ---------------------------------------------------------------------------
 * The painted fish loop plays BEHIND the word and shows only through the
 * letters; dark water everywhere else. Built as an SVG <mask>: a solid water
 * panel with letter-shaped holes sits over two stacked video copies.
 *
 * Seamless loop: the ~5s clip is not a perfect loop, so a second copy runs
 * offset by half its duration and the two crossfade across the seam, dissolving
 * into themselves with no visible cut.
 *
 * A static radial vignette sinks the edges. A ScrollTrigger scrub drifts the
 * media band (transform only) so it parallaxes as you pass. Reduced motion and
 * no-video fallbacks show the poster through the same mask, perfectly still.
 */
import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/app/lib/gsap";

const WORD = "AHSON";
const POSTER = "/assets/painted/fish-school-poster.jpg";

export default function FishWordmark() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      const section = sectionRef.current;
      const media = mediaRef.current;
      if (!section || !media) return;

      if (prefersReducedMotion()) {
        setReduced(true);
        return;
      }

      const a = aRef.current;
      const b = bRef.current;

      // Parallax drift (transform only) as the band passes through view.
      const drift = gsap.fromTo(
        media,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Crossfade loop across the seam.
      let rafId = 0;
      let active = false;
      const FADE = 0.6; // seconds of crossfade around video A's wrap

      const startVideos = () => {
        if (!a || !b) return;
        const dur = a.duration || 5;
        b.currentTime = Math.min(dur / 2, dur - 0.05);
        void a.play().catch(() => {});
        void b.play().catch(() => {});
      };

      const tick = () => {
        if (a && b) {
          const dur = a.duration || 5;
          const t = a.currentTime;
          let opA = 1;
          if (t < FADE) opA = t / FADE;
          else if (t > dur - FADE) opA = (dur - t) / FADE;
          a.style.opacity = String(opA);
          b.style.opacity = String(1 - opA);
        }
        rafId = requestAnimationFrame(tick);
      };

      const run = (on: boolean) => {
        if (on === active) return;
        active = on;
        if (on) {
          void a?.play().catch(() => {});
          void b?.play().catch(() => {});
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
          a?.pause();
          b?.pause();
        }
      };

      if (a) {
        if (a.readyState >= 1) startVideos();
        else a.addEventListener("loadedmetadata", startVideos, { once: true });
      }

      // Only animate while the band is on screen.
      const vis = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => run(self.isActive),
      });

      return () => {
        cancelAnimationFrame(rafId);
        drift.scrollTrigger?.kill();
        drift.kill();
        vis.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="fish-band"
      aria-label={`${WORD}, fish swimming through the letters`}
    >
      <div ref={mediaRef} className="fish-media">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" className="fish-video" />
        ) : (
          <>
            <video
              ref={aRef}
              className="fish-video"
              poster={POSTER}
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/assets/painted/fish-school.webm" type="video/webm" />
              <source src="/assets/painted/fish-school.mp4" type="video/mp4" />
            </video>
            <video
              ref={bRef}
              className="fish-video"
              muted
              loop
              playsInline
              preload="auto"
              style={{ opacity: 0 }}
            >
              <source src="/assets/painted/fish-school.webm" type="video/webm" />
              <source src="/assets/painted/fish-school.mp4" type="video/mp4" />
            </video>
          </>
        )}
      </div>

      {/* Water panel with letter-shaped holes: fish show only through the word. */}
      <svg
        className="fish-mask"
        viewBox="0 0 1200 360"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <mask id="fish-cut">
            <rect x="0" y="0" width="1200" height="360" fill="#fff" />
            <text
              x="600"
              y="208"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fish-word"
            >
              {WORD}
            </text>
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="1200"
          height="360"
          fill="currentColor"
          mask="url(#fish-cut)"
        />
      </svg>

      <div className="fish-vignette" aria-hidden="true" />
    </section>
  );
}
