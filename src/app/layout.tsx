import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { structuredData } from "@/lib/structured-data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "VerityLoop | AI Product Decision Platform",
  description:
    "VerityLoop is an AI product decision platform that uses evidence agents to turn market signals into cited decisions, agent-ready PRDs, and reviewed tickets.",
  applicationName: "VerityLoop",
  authors: [{ name: "VerityLoop" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "VerityLoop",
    title: "VerityLoop | AI Product Decision Platform",
    description:
      "Source-grounded product intelligence for opportunity discovery and roadmap impact. Move from evidence to agent-ready delivery work with human approval.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerityLoop | AI Product Decision Platform",
    description: "Evidence agents, MCP-ready context, and human-approved product decisions.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fb",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSerif.variable}`}>
      <body>
        {structuredData.map((entry) => (
          <script
            key={entry["@type"] as string}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(entry).replace(/</g, "\\u003c"),
            }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
