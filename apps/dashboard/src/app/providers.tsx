"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { LinkProvider } from "@astryxdesign/core/Link";
import { Theme } from "@astryxdesign/core/theme";
import { verityloopTheme } from "@/themes/verityloop";
import { DemoProvider } from "@/lib/preview-store";

// "Close dialog" is clearer than the default "Close" and is the name the e2e tests use.
const OVERRIDES = { en: { "@astryx.dialog.close": "Close dialog" } };

export function Providers({ children }: { children: ReactNode }) {
  return <InternationalizationProvider locale="en" overrides={OVERRIDES}>
    <Theme theme={verityloopTheme} mode="system">
      <LinkProvider component={Link}>
        <DemoProvider>{children}</DemoProvider>
      </LinkProvider>
    </Theme>
  </InternationalizationProvider>;
}
