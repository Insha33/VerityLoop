"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Copy, Link2, Plus, Trash2 } from "lucide-react";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Selector } from "@astryxdesign/core/Selector";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import { PageHeading } from "@/components/app-shell";
import { advanceStage, validateInvitations, workspacePath, type Invitation } from "@/features/workspaces/model";
import { SetupNav, useWorkspace, WorkspaceGuard } from "@/features/workspaces/workspace-frame";

export function InvitePage() {
  const { workspace, state, updateWorkspace } = useWorkspace();
  const router = useRouter();
  const [rows, setRows] = useState<Invitation[]>([{ email: "", role: "Reviewer" }]);
  const [error, setError] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!workspace) return <WorkspaceGuard />;
  const current = workspace;
  function change(index: number, value: Partial<Invitation>) {
    setRows((items) => items.map((item, rowIndex) => rowIndex === index ? { ...item, ...value } : item)); setError("");
  }
  function advance(event?: FormEvent, skip = false) {
    event?.preventDefault();
    const problem = !skip && validateInvitations(rows, state.profile?.email ?? "");
    if (problem) { setError(problem); return; }
    updateWorkspace(current.id, (item) => ({ ...item, stage: advanceStage(item.stage, "connections"), invitations: skip ? item.invitations : [
      ...item.invitations,
      ...rows.filter((row) => row.email.trim() && !item.invitations.some((invite) => invite.email === row.email.trim().toLowerCase())).map((row) => ({ ...row, email: row.email.trim().toLowerCase() })),
    ] }));
    router.push(workspacePath(current.id, "connections"));
  }
  const inviteLink = current.inviteLink ? `${typeof window === "undefined" ? "" : window.location.origin}${workspacePath(current.id)}?previewInvite=${current.inviteLink.token}` : "";
  function generateLink() {
    updateWorkspace(current.id, (item) => ({ ...item, inviteLink: item.inviteLink ?? { token: crypto.randomUUID(), expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 } }));
    setCopied(false); setLinkOpen(true);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(inviteLink); setCopied(true); } catch { setError("Select the link and copy it using your keyboard."); }
  }
  return <WorkspaceGuard workspace={current} manage>
    <SetupNav workspace={current} active="invite" />
    <div className="heading-with-aside"><PageHeading title="Invite your colleagues" subtitle={`Bring your team into ${current.name}. You can do this later.`} /><p className="heading-aside">Invites grant access only to {current.name}.</p></div>
    <form onSubmit={(event) => advance(event)} noValidate>
      <div className="invite-fields">{rows.map((row, index) => <div className="invite-row" key={index}>
        {/* The validation message sits on the first field; the others show the error state. */}
        <TextInput type="email" label={`Work email${rows.length > 1 ? ` ${index + 1}` : ""}`} placeholder="colleague@company.com" autoComplete="off" size="lg" value={row.email}
          onChange={(value) => change(index, { email: value })} status={error ? (index === 0 ? { type: "error", message: error } : { type: "error" }) : undefined} statusVariant="detached" />
        <Selector label="Access" size="lg" options={["Reviewer", "Editor"]} value={row.role} onChange={(value) => change(index, { role: (value ?? "Reviewer") as Invitation["role"] })} />
        {rows.length > 1 ? <IconButton variant="ghost" size="lg" label={`Remove invitation ${index + 1}`} icon={<Icon icon={Trash2} />} onClick={() => setRows((items) => items.filter((_, rowIndex) => rowIndex !== index))} /> : <span />}
      </div>)}</div>
      <Button variant="ghost" label="Add another" icon={<Icon icon={Plus} />} onClick={() => setRows((items) => [...items, { email: "", role: "Reviewer" }])} />
      <section className="invite-link-section"><h2>Or share an invite link</h2><p>Create a link for this workspace.</p><div className="invite-link-button"><Button size="lg" label={current.inviteLink ? "Manage invite link" : "Generate invite link"} icon={<Icon icon={Link2} />} onClick={generateLink} /></div><p className="helper">{current.organization ? `${current.organization} colleagues can also request access from their Workspaces page.` : "Invite collaborators by email. Personal email domains do not grant workspace access."}</p></section>
      {current.invitations.length > 0 && <p className="helper">{current.invitations.length} preview invitation{current.invitations.length === 1 ? "" : "s"} saved. No emails have been sent.</p>}
      <div className="action-bar setup-actions"><Button variant="ghost" href="/workspaces" label="Back" icon={<Icon icon={ArrowLeft} />} /><div><Button variant="ghost" size="lg" label="Skip for now" onClick={() => advance(undefined, true)} /><Button type="submit" variant="primary" size="lg" label={rows.some((row) => row.email.trim()) ? "Send invite & continue" : "Continue to connections"} endContent={<Icon icon={ArrowRight} />} /></div></div>
    </form>
    <Dialog isOpen={linkOpen} onOpenChange={setLinkOpen} width={560}>
      <DialogHeader title="Workspace invite link" onOpenChange={setLinkOpen} />
      <VStack gap={4} padding={4}>
        <Text type="supporting" color="secondary">Preview link only. It does not grant real access or deliver an invitation; it opens this workspace in your existing demo session.</Text>
        {current.inviteLink ? <>
          <TextInput label={`Link for ${current.name}`} value={inviteLink} isReadOnly />
          <Text type="supporting" color="secondary">Role: Reviewer · Expires {new Date(current.inviteLink.expiresAt).toLocaleDateString()}<br />{current.organization ? `Intended organization: ${current.organization}` : "Explicitly invited collaborators only"}</Text>
          <HStack gap={2} justify="end"><Button variant="destructive" label="Revoke link" onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, inviteLink: null })); setCopied(false); }} /><Button variant="primary" label={copied ? "Copied" : "Copy link"} icon={<Icon icon={Copy} />} onClick={copy} /></HStack>
          {copied && <Text type="supporting" color="secondary"><span role="status">Preview link copied.</span></Text>}
        </> : <>
          <Text>Link revoked. You can generate a new one when you need it.</Text>
          <HStack justify="end"><Button variant="primary" label="Generate new link" onClick={generateLink} /></HStack>
        </>}
      </VStack>
    </Dialog>
  </WorkspaceGuard>;
}
