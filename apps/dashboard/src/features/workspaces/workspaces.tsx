"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Building2, Clock3, Layers, LockKeyhole, Plus } from "lucide-react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import { PageHeading } from "@/components/app-shell";
import { newWorkspace, workspacePath, type Workspace } from "@/features/workspaces/model";
import { useDemo } from "@/lib/preview-store";

export function WorkspaceDirectory() {
  const { state, updateWorkspace } = useDemo();
  const [search, setSearch] = useState("");
  const [request, setRequest] = useState<Workspace | null>(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const profile = state.profile;
  if (!profile) return null;
  const matches = state.workspaces.filter((workspace) => workspace.name.toLowerCase().includes(search.toLowerCase()));
  function sendRequest(event: FormEvent) {
    event.preventDefault();
    if (!request) return;
    updateWorkspace(request.id, (workspace) => ({ ...workspace, requested: true }));
    setNotice(`Preview request recorded for ${request.name}. No notification was sent.`);
    setRequest(null); setMessage("");
  }
  return <>
    <PageHeading title="Workspaces" subtitle={profile.organization ? `Find a workspace at ${profile.organization}, request access, or create your own.` : "Open a workspace you belong to or create a personal workspace."} action={<Button variant="primary" size="lg" href="/workspaces/new" label="Create workspace" icon={<Icon icon={Plus} />} />} />
    <div className="directory-identity"><Building2 size={23} aria-hidden="true" /><strong>{profile.organization ?? "Personal workspaces"}</strong>{profile.organization && <span>· {profile.domain}</span>}</div>
    <div className="search-field"><TextInput type="search" label="Search workspaces" isLabelHidden placeholder="Search workspaces" startIcon="search" size="lg" value={search} onChange={setSearch} /></div>
    {notice && <p className="success-notice" role="status">{notice}</p>}
    {matches.length ? <div className="workspace-table" role="table" aria-label="Available workspaces"><div className="workspace-table-header" role="row"><span role="columnheader">Workspace</span><span role="columnheader">Your access</span><span role="columnheader">Action</span></div>{matches.map((workspace) => <div className="workspace-table-row" role="row" key={workspace.id}>
      <div className="workspace-name" role="cell"><Avatar name={workspace.name} shape="rounded" size="md" tooltip={false} /><strong>{workspace.name}</strong></div>
      <div className="workspace-access" role="cell">{workspace.role ?? (workspace.requested ? "Request pending" : "Owner approval required")}</div>
      <div className="workspace-action" role="cell">{workspace.role ? <Button width="100%" href={workspace.stage === "complete" ? workspacePath(workspace.id) : workspacePath(workspace.id, workspace.stage)} label={workspace.stage === "complete" ? "Open" : "Resume setup"} /> : workspace.requested ? <div className="request-pending"><span className="pending-state"><Clock3 size={16} aria-hidden="true" />Request sent</span><Button variant="ghost" size="sm" label="Withdraw" onClick={() => updateWorkspace(workspace.id, (item) => ({ ...item, requested: false }))} /></div> : <Button width="100%" label="Request access" onClick={() => { setRequest(workspace); setMessage(""); }} />}</div>
    </div>)}</div> : <div className="empty-state"><Layers size={30} aria-hidden="true" /><h2>{search ? "No matching workspaces" : "Your first workspace starts here"}</h2><p>{search ? "Try a different workspace name." : "Create a private home for your product, documents, and decisions."}</p>{search ? <Button label="Clear search" onClick={() => setSearch("")} /> : <Button variant="primary" href="/workspaces/new" label="Create workspace" endContent={<Icon icon={ArrowRight} />} />}</div>}
    <div className="directory-footnote"><p><LockKeyhole size={18} aria-hidden="true" />Workspace content stays private until its owner grants access.</p>{profile.organization && <p>Workspaces created with your company email are linked to {profile.organization}.</p>}</div>
    <Dialog isOpen={request !== null} onOpenChange={(isOpen) => { if (!isOpen) setRequest(null); }} width={560}>
      <form onSubmit={sendRequest}>
        <DialogHeader title={`Request access to ${request?.name ?? ""}`} onOpenChange={() => setRequest(null)} />
        <VStack gap={4} padding={4}>
          <Text>Ask the workspace owner to review your access request.</Text>
          <Text type="supporting" color="secondary">Requesting as {profile.email}. In this preview, requests are recorded locally and do not grant access.</Text>
          <TextArea label="Message" isOptional value={message} onChange={setMessage} maxLength={500} placeholder="Tell the owner how you’d like to collaborate." />
          <HStack gap={2} justify="end"><Button variant="ghost" label="Cancel" onClick={() => setRequest(null)} /><Button type="submit" variant="primary" label="Send request" endContent={<Icon icon={ArrowRight} />} /></HStack>
        </VStack>
      </form>
    </Dialog>
  </>;
}

export function CreateWorkspace() {
  const { state, addWorkspace } = useDemo();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const profile = state.profile;
  if (!profile) return null;
  function create(event: FormEvent) {
    event.preventDefault();
    if (!profile || busy) return;
    try {
      const workspace = newWorkspace(crypto.randomUUID(), name, profile.organization);
      setBusy(true); addWorkspace(workspace); router.push(workspacePath(workspace.id, "invite"));
    } catch (failure) { setError((failure as Error).message); }
  }
  return <div className="narrow-page"><PageHeading title="Create a workspace" subtitle="Give your product team a space of its own." />
    <form onSubmit={create} noValidate><div className="field"><TextInput label="Workspace name" isRequired autoComplete="off" placeholder="e.g. Core Platform" size="lg" value={name} onChange={(value) => { setName(value); setError(""); }} status={error ? { type: "error", message: error } : undefined} statusVariant="detached" /></div>
      <div className="creation-organization"><span className="feature-icon small"><Building2 size={23} aria-hidden="true" /></span><div><strong>{profile.organization ? `Organization: ${profile.organization}` : "Personal workspace"}</strong><p className="helper">{profile.organization ? `Linked automatically through your ${profile.domain} email in this preview.` : "Your workspace belongs to you, with no organization attached."}</p></div></div>
      <p className="creation-description">{profile.organization ? `Colleagues at ${profile.organization} can find this workspace and request access. You decide who joins.` : "You can invite collaborators while keeping your product work private."}</p>
      <div className="action-bar"><Button variant="ghost" href="/workspaces" label="Cancel" /><Button type="submit" variant="primary" size="lg" isLoading={busy} label={busy ? "Creating workspace…" : "Create workspace"} /></div>
    </form></div>;
}
