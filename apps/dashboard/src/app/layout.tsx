import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./layers.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "VerityLoop | Product",
  description: "VerityLoop product workspace.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/favicon.svg" },
};

// suppressHydrationWarning covers only the attributes of <html> and <body> themselves (not their children):
// browser extensions such as LanguageTool and Grammarly add attributes there before React hydrates,
// and the Astryx Theme updates <html> attributes after hydration.
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><Providers>{children}</Providers></body></html>;
}
