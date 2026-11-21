import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DemoProvider } from "@/lib/preview-store";

export const metadata: Metadata = {
  title: "VerityLoop | Product",
  description: "VerityLoop product workspace.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><DemoProvider>{children}</DemoProvider></body></html>;
}
