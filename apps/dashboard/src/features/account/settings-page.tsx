"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui";
import { PageHeading } from "@/components/app-shell";
import { useDemo } from "@/lib/preview-store";

export function SettingsPage() {
  const { state, signOut } = useDemo();
  const router = useRouter();
  const [reset, setReset] = useState(false);
  return <div className="narrow-page"><PageHeading title="Account settings" subtitle="Your profile and product preview." /><dl className="settings-list"><div><dt>Name</dt><dd>{state.profile?.name}</dd></div><div><dt>Email</dt><dd>{state.profile?.email}</dd></div><div><dt>Organization</dt><dd>{state.profile?.organization ?? "Personal account"}</dd></div></dl><section className="settings-preview"><h2>About this preview</h2><p>Workspaces and setup progress are saved in this browser tab. There is no live authentication, organization directory, email delivery, document ingestion, or provider connection.</p><button className="button secondary" onClick={() => setReset(true)}>Reset preview</button></section>{reset && <Modal title="Reset this preview?" onClose={() => setReset(false)}><p>This clears the sample account, workspaces, invitations, connections, and document metadata in this tab. No external data is affected.</p><div className="dialog-actions"><button className="text-button" onClick={() => setReset(false)}>Cancel</button><button className="button primary" onClick={() => { signOut(); router.push("/sign-up"); }}>Reset preview</button></div></Modal>}</div>;
}
