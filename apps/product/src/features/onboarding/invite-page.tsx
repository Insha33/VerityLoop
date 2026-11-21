"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Copy, Link2, Plus, Trash2 } from "lucide-react";
import { Arrow, Modal } from "@/components/ui";
import { PageHeading } from "./app-shell";
import { advanceStage, validateInvitations, workspacePath, type Invitation } from "./model";
import { SetupNav, useWorkspace, WorkspaceGuard } from "./workspace-frame";

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
  return <WorkspaceGuard workspace={current} manage>
    <SetupNav workspace={current} active="invite" />
    <div className="heading-with-aside"><PageHeading title="Invite your colleagues" subtitle={`Bring your team into ${current.name}. You can do this later.`} /><p className="heading-aside">Invites grant access only to {current.name}.</p></div>
    <form onSubmit={(event) => advance(event)} noValidate>
      <div className="invite-fields">{rows.map((row, index) => <div className="invite-row" key={index}><div className="field"><label htmlFor={`invite-email-${index}`}>Work email{rows.length > 1 ? ` ${index + 1}` : ""}</label><input id={`invite-email-${index}`} type="email" placeholder="colleague@company.com" autoComplete="off" value={row.email} onChange={(event) => change(index, { email: event.target.value })} aria-describedby={error ? "invite-error" : undefined} /></div><div className="field"><label htmlFor={`invite-access-${index}`}>Access</label><select id={`invite-access-${index}`} value={row.role} onChange={(event) => change(index, { role: event.target.value as Invitation["role"] })}><option>Reviewer</option><option>Editor</option></select></div>{rows.length > 1 && <button type="button" className="icon-button remove-row" aria-label={`Remove invitation ${index + 1}`} onClick={() => setRows((items) => items.filter((_, rowIndex) => rowIndex !== index))}><Trash2 size={18} /></button>}</div>)}</div>
      <button type="button" className="text-button add-another" onClick={() => setRows((items) => [...items, { email: "", role: "Reviewer" }])}><Plus size={17} />Add another</button>
      {error && <p className="error" id="invite-error" role="alert">{error}</p>}
      <section className="invite-link-section"><h2>Or share an invite link</h2><p>Create a link for this workspace.</p><button type="button" className="button secondary" onClick={generateLink}><Link2 size={20} />{current.inviteLink ? "Manage invite link" : "Generate invite link"}</button><p className="helper">{current.organization ? `${current.organization} colleagues can also request access from their Workspaces page.` : "Invite collaborators by email. Personal email domains do not grant workspace access."}</p></section>
      {current.invitations.length > 0 && <p className="helper">{current.invitations.length} preview invitation{current.invitations.length === 1 ? "" : "s"} saved. No emails have been sent.</p>}
      <div className="action-bar setup-actions"><Link href="/app/workspaces" className="text-button"><ArrowLeft size={18} />Back</Link><div><button type="button" className="text-button" onClick={() => advance(undefined, true)}>Skip for now</button><button className="button primary">{rows.some((row) => row.email.trim()) ? "Send invite & continue" : "Continue to connections"}<Arrow /></button></div></div>
    </form>
    {linkOpen && <Modal title="Workspace invite link" onClose={() => setLinkOpen(false)}><p className="helper">Preview link only. It does not grant real access or deliver an invitation; it opens this workspace in your existing demo session.</p>{current.inviteLink ? <>
      <div className="field"><label htmlFor="invite-link">Link for {current.name}</label><input id="invite-link" readOnly value={inviteLink} onFocus={(event) => event.target.select()} /></div>
      <p className="helper">Role: Reviewer · Expires {new Date(current.inviteLink.expiresAt).toLocaleDateString()}<br />{current.organization ? `Intended organization: ${current.organization}` : "Explicitly invited collaborators only"}</p>
      <div className="dialog-actions"><button className="text-button danger" onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, inviteLink: null })); setCopied(false); }}>Revoke link</button><button className="button primary" onClick={async () => { try { await navigator.clipboard.writeText(inviteLink); setCopied(true); } catch { setError("Select the link and copy it using your keyboard."); } }}><Copy size={17} />{copied ? "Copied" : "Copy link"}</button></div>
      {copied && <p className="helper" role="status">Preview link copied.</p>}
    </> : <><p>Link revoked. You can generate a new one when you need it.</p><button className="button primary" onClick={generateLink}>Generate new link</button></>}</Modal>}
  </WorkspaceGuard>;
}
