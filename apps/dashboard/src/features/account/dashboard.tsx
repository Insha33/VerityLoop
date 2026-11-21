"use client";

import { ArrowRight, Building2, Layers, LockKeyhole } from "lucide-react";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { PageHeading } from "@/components/app-shell";
import { useDemo } from "@/lib/preview-store";
import { workspacePath } from "@/features/workspaces/model";

export function Dashboard() {
  const { state } = useDemo();
  const profile = state.profile;
  if (!profile) return null;
  const unfinished = state.workspaces.filter((workspace) => workspace.role === "Owner" && workspace.stage !== "complete");
  return <>
    <PageHeading title={`Welcome, ${profile.name.split(" ")[0]}`} subtitle="Start by opening or creating a workspace." />
    <section className="dashboard-start"><span className="feature-icon"><Layers size={26} aria-hidden="true" /></span><div><h2>Your work starts in a workspace</h2><p>{profile.organization ? "Find your company’s workspaces, request access, or create a space for your product." : "Open a workspace you belong to, or create a personal space for your product."}</p><Button variant="primary" size="lg" href="/workspaces" label="Go to workspaces" endContent={<Icon icon={ArrowRight} />} /></div></section>
    <section className="organization-strip" aria-label={profile.organization ? "Your organization" : "Personal account"}><div><Building2 size={25} aria-hidden="true" /><div><strong>{profile.organization ?? "Personal account"}</strong><span>{profile.organization ? `Linked through ${profile.domain}` : "Your workspaces belong to you"}</span></div></div><p><LockKeyhole size={17} aria-hidden="true" />{profile.organization ? "Workspace owners approve access. Product data stays private until you join." : "Invite collaborators when you’re ready. Each workspace has separate access."}</p></section>
    <p className="dashboard-hint">You can connect tools and add product documents after creating a workspace.</p>
    {unfinished.length > 0 && <section className="resume-section"><h2>Pick up where you left off</h2><div className="simple-list">{unfinished.map((workspace) => <div key={workspace.id}><div><strong>{workspace.name}</strong><p className="helper">Workspace setup is in progress</p></div><Button href={workspacePath(workspace.id, workspace.stage)} label="Resume setup" endContent={<Icon icon={ArrowRight} />} /></div>)}</div></section>}
  </>;
}
