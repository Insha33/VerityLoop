"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { PageHeading } from "@/components/app-shell";
import { useDemo } from "@/lib/preview-store";

export function SettingsPage() {
  const { state, signOut } = useDemo();
  const router = useRouter();
  const [reset, setReset] = useState(false);
  return <div className="narrow-page"><PageHeading title="Account settings" subtitle="Your profile and product preview." />
    <dl className="settings-list"><div><dt>Name</dt><dd>{state.profile?.name}</dd></div><div><dt>Email</dt><dd>{state.profile?.email}</dd></div><div><dt>Organization</dt><dd>{state.profile?.organization ?? "Personal account"}</dd></div></dl>
    <section className="settings-preview"><h2>About this preview</h2><p>Workspaces and setup progress are saved in this browser tab. There is no live authentication, organization directory, email delivery, document ingestion, or provider connection.</p><Button label="Reset preview" onClick={() => setReset(true)} /></section>
    <Dialog isOpen={reset} onOpenChange={setReset}>
      <DialogHeader title="Reset this preview?" onOpenChange={setReset} />
      <VStack gap={6} padding={4}>
        <Text>This clears the sample account, workspaces, invitations, connections, and document metadata in this tab. No external data is affected.</Text>
        <HStack gap={2} justify="end"><Button variant="ghost" label="Cancel" onClick={() => setReset(false)} /><Button variant="destructive" label="Reset preview" onClick={() => { signOut(); router.push("/sign-up"); }} /></HStack>
      </VStack>
    </Dialog>
  </div>;
}
