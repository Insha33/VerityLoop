"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, LockKeyhole } from "lucide-react";
import { useDemo } from "./store";
import { canManage, canOpen, workspacePath, type Workspace } from "./model";
import { PageHeading } from "./app-shell";

export function useWorkspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const demo = useDemo();
  return { ...demo, workspace: demo.state.workspaces.find((item) => item.id === workspaceId) };
}
export function WorkspaceGuard({ workspace, manage = false, children }: { workspace?: Workspace; manage?: boolean; children?: React.ReactNode }) {
  if (!workspace || !canOpen(workspace) || (manage && !canManage(workspace))) return <div className="narrow-page"><PageHeading title={workspace && canOpen(workspace) ? "Workspace owner access required" : "This workspace isn’t available"} subtitle="Open a workspace you have access to, or request access from its owner." /><p className="helper"><LockKeyhole size={18} />This preview does not grant access through a direct URL.</p><Link href="/app/workspaces" className="button secondary">Back to workspaces</Link></div>;
  return <>{children}</>;
}
export function SetupNav({ workspace, active }: { workspace: Workspace; active: "invite" | "connections" | "documents" }) {
  const steps = [{ id: "invite", label: "Invite (optional)" }, { id: "connections", label: "Connections" }, { id: "documents", label: "Documents" }] as const;
  return <nav className="setup-nav" aria-label="Workspace setup">{steps.map((step) => {
    const blocked = step.id === "documents" && !workspace.connections.some((item) => item.sources.length);
    const done = step.id === "invite" ? workspace.invitations.length > 0 : step.id === "connections" ? workspace.connections.length > 0 : workspace.stage === "complete";
    return blocked ? <span key={step.id} className="setup-disabled" title="Connect a tool before adding documents">{step.label}</span> : <Link key={step.id} href={workspacePath(workspace.id, step.id)} aria-current={step.id === active ? "step" : undefined} className={step.id === active ? "active" : ""}>{step.label}{done && step.id !== active && <Check size={14} aria-label="Completed" />}</Link>;
  })}</nav>;
}

export function WorkspaceOverview() {
  const { workspace } = useWorkspace();
  return <WorkspaceGuard workspace={workspace}>{workspace && <>
    <PageHeading title={workspace.name} subtitle="Your product context, together in one workspace." />
    <section className="workspace-overview"><h2>{workspace.stage === "complete" ? "Your workspace is ready for review" : "Finish setting up your workspace"}</h2><p>{workspace.stage === "complete" ? "Review the context you added before preparing a product profile. Nothing has been analyzed or published." : "Connect your product tools and add supporting documents when you’re ready."}</p>
      {workspace.role === "Owner" ? <div className="overview-links"><Link className="button primary" href={workspacePath(workspace.id, workspace.stage === "complete" ? "documents" : workspace.stage)}>{workspace.stage === "complete" ? "Review product documents" : "Resume workspace setup"}</Link><Link className="button secondary" href={workspacePath(workspace.id, "connections")}>Manage connections</Link></div> : <p className="helper">You have Reviewer access. Ask the workspace owner to manage connections and documents.</p>}
    </section>
    <div className="context-summary"><div><h2>Connections</h2><p>{workspace.connections.length ? workspace.connections.map((item) => item.provider).join(", ") : "No connections added"}</p></div><div><h2>Product documents</h2><p>{workspace.documents.length ? `${workspace.documents.length} file${workspace.documents.length === 1 ? "" : "s"} added to this preview` : "No documents added"}</p></div></div>
  </>}</WorkspaceGuard>;
}
