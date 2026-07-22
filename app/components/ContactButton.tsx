"use client";

/**
 * ContactButton - the "Let's talk" action. Opens the visitor's mail client
 * via mailto AND copies the address to the clipboard on the same click, so
 * the button is never a dead end on machines with no mail handler. The label
 * flips to a "Copied" confirmation for a beat, then settles back.
 */
import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/app/lib/site.config";

export default function ContactButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    // The anchor's default mailto navigation proceeds untouched; the copy is
    // the guarantee. Clipboard API needs a secure context; fail silently.
    navigator.clipboard
      ?.writeText(CONTACT_EMAIL)
      .then(() => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {});
  };

  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      data-magnetic
      className="btn-quiet"
      onClick={onClick}
      aria-live="polite"
      title={CONTACT_EMAIL}
    >
      {copied ? (
        <>
          Copied <span aria-hidden>&#10003;</span>
        </>
      ) : (
        <>Let&rsquo;s talk</>
      )}
    </a>
  );
}
