"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Building2, Clock3, Layers, LockKeyhole, Plus, Search } from "lucide-react";
import { Arrow, Avatar, Modal } from "@/components/ui";
import { PageHeading } from "./app-shell";
import { newWorkspace, workspacePath, type Workspace } from "./model";
import { useDemo } from "./store";

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
    <PageHeading title="Workspaces" subtitle={profile.organization ? `Find a workspace at ${profile.organization}, request access, or create your own.` : "Open a workspace you belong to or create a personal workspace."} action={<Link className="button primary" href="/app/workspaces/new"><Plus size={19} />Create workspace</Link>} />
    <div className="directory-identity"><Building2 size={23} aria-hidden="true" /><strong>{profile.organization ?? "Personal workspaces"}</strong>{profile.organization && <span>· {profile.domain}</span>}</div>
    <label className="search-field"><Search size={19} aria-hidden="true" /><span className="sr-only">Search workspaces</span><input type="search" placeholder="Search workspaces" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
    {notice && <p className="success-notice" role="status">{notice}</p>}
    {matches.length ? <div className="workspace-table" role="table" aria-label="Available workspaces"><div className="workspace-table-header" role="row"><span role="columnheader">Workspace</span><span role="columnheader">Your access</span><span role="columnheader">Action</span></div>{matches.map((workspace) => <div className="workspace-table-row" role="row" key={workspace.id}>
      <div className="workspace-name" role="cell"><Avatar name={workspace.name} /><strong>{workspace.name}</strong></div>
      <div className="workspace-access" role="cell">{workspace.role ?? (workspace.requested ? "Request pending" : "Owner approval required")}</div>
      <div className="workspace-action" role="cell">{workspace.role ? <Link className="button secondary" href={workspace.stage === "complete" ? workspacePath(workspace.id) : workspacePath(workspace.id, workspace.stage)}>{workspace.stage === "complete" ? "Open" : "Resume setup"}</Link> : workspace.requested ? <div className="request-pending"><span className="pending-state"><Clock3 size={16} />Request sent</span><button className="text-button small" onClick={() => updateWorkspace(workspace.id, (item) => ({ ...item, requested: false }))}>Withdraw</button></div> : <button className="button secondary" onClick={() => { setRequest(workspace); setMessage(""); }}>Request access</button>}</div>
    </div>)}</div> : <div className="empty-state"><Layers size={30} /><h2>{search ? "No matching workspaces" : "Your first workspace starts here"}</h2><p>{search ? "Try a different workspace name." : "Create a private home for your product, documents, and decisions."}</p>{search ? <button className="button secondary" onClick={() => setSearch("")}>Clear search</button> : <Link className="button primary" href="/app/workspaces/new">Create workspace<Arrow /></Link>}</div>}
    <div className="directory-footnote"><p><LockKeyhole size={18} aria-hidden="true" />Workspace content stays private until its owner grants access.</p>{profile.organization && <p>Workspaces created with your company email are linked to {profile.organization}.</p>}</div>
    {request && <Modal title={`Request access to ${request.name}`} onClose={() => setRequest(null)}><form onSubmit={sendRequest}><p>Ask the workspace owner to review your access request.</p><p className="helper">Requesting as {profile.email}. In this preview, requests are recorded locally and do not grant access.</p><div className="field"><label htmlFor="request-note">Message <span>(optional)</span></label><textarea id="request-note" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} placeholder="Tell the owner how you’d like to collaborate." /></div><div className="dialog-actions"><button type="button" className="text-button" onClick={() => setRequest(null)}>Cancel</button><button className="button primary">Send request<Arrow /></button></div></form></Modal>}
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
    <form onSubmit={create} noValidate><div className="field"><label htmlFor="workspace-name">Workspace name <span className="required">*</span></label><input id="workspace-name" autoComplete="off" placeholder="e.g. Core Platform" required maxLength={80} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "workspace-error" : undefined} />{error && <p id="workspace-error" className="error" role="alert">{error}</p>}</div>
      <div className="creation-organization"><span className="feature-icon small"><Building2 size={23} /></span><div><strong>{profile.organization ? `Organization: ${profile.organization}` : "Personal workspace"}</strong><p className="helper">{profile.organization ? `Linked automatically through your ${profile.domain} email in this preview.` : "Your workspace belongs to you, with no organization attached."}</p></div></div>
      <p className="creation-description">{profile.organization ? `Colleagues at ${profile.organization} can find this workspace and request access. You decide who joins.` : "You can invite collaborators while keeping your product work private."}</p>
      <div className="action-bar"><Link className="text-button" href="/app/workspaces">Cancel</Link><button className="button primary" disabled={busy}>{busy ? "Creating workspace…" : "Create workspace"}</button></div>
    </form></div>;
}
