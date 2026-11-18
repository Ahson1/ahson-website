import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  PERSON_JSONLD,
  SEO_DESCRIPTION,
  SEO_TITLE,
  SITE_URL,
} from "@/app/lib/site.config";

/* One designed system: Geist carries headlines, body and UI; Geist Mono carries
   stat numerals and telemetry labels. next/font self-hosts the variable woff2
   at build time, subsets to latin, preloads it, and injects a size-matched
   fallback (no layout shift). display: swap is the default. */
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  openGraph: {
    type: "profile",
    siteName: "Ahson Kamal",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

// Browser chrome sits on the instrument off-black.
export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Person structured data: tells search engines and AI assistants who
            this site is about. Source of truth: app/lib/site.config.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(PERSON_JSONLD).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
