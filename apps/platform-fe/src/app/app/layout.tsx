import type { ReactNode } from "react";
import { AppShell } from "@/features/onboarding/app-shell";
export default function AccountLayout({ children }: { children: ReactNode }) { return <AppShell>{children}</AppShell>; }
