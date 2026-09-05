import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { structuredData } from "@/lib/structured-data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://runverityloop.com"),
  title: "VerityLoop | AI Product Decision Platform",
  description:
    "Turn verified market changes into cited Opportunity Briefs and Roadmap Impact Briefs. Decide what to validate, build, change, watch, or ignore.",
  applicationName: "VerityLoop",
  authors: [{ name: "VerityLoop" }],
  creator: "VerityLoop",
  publisher: "VerityLoop",
  icons: {
    icon: [
      {
        url: "/verityloop-logo.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
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
    url: "/",
    locale: "en_US",
    siteName: "VerityLoop",
    title: "VerityLoop | AI Product Decision Platform",
    description:
      "Source-grounded product intelligence for opportunity discovery and roadmap impact. Move from evidence to agent-ready delivery work with human approval.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerityLoop | AI Product Decision Platform",
    description: "Cited opportunity and roadmap impact briefs. Human decisions before PRDs and delivery work.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f6",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
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
