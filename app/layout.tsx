import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Ahson Kamal | Complex technical systems, built end to end",
  description:
    "Sydney. Product leader and technical founder. Ten years building voice and workflow AI in healthcare, where the edge cases are the job.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
