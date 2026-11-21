"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, CircleHelp, Info, LockKeyhole, Unplug } from "lucide-react";
import { Arrow, Badge, Modal } from "@/components/ui";
import { PageHeading } from "@/components/app-shell";
import { advanceStage, hasScopedConnection, workspacePath, type Provider } from "@/features/workspaces/model";
import { SetupNav, useWorkspace, WorkspaceGuard } from "@/features/workspaces/workspace-frame";

const PROVIDERS: { name: Provider; description: string; image?: string; options: string[] }[] = [
  { name: "Jira", description: "Projects, issues and delivery status", image: "/integrations/jira.png", options: ["Core Platform", "API Platform", "Sandbox"] },
  { name: "Confluence", description: "Spaces, PRDs and product knowledge", options: ["Product strategy", "Engineering architecture", "Customer research"] },
  { name: "Linear", description: "Teams, projects and issues", image: "/integrations/linear.png", options: ["Product", "Engineering", "Design"] },
];
export function ConnectionsPage() {
  const { workspace, updateWorkspace } = useWorkspace();
  const [selected, setSelected] = useState<Provider | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [more, setMore] = useState(false);
  const [disconnect, setDisconnect] = useState<Provider | null>(null);
  const [notice, setNotice] = useState("");
  if (!workspace) return <WorkspaceGuard />;
  const current = workspace;
  const provider = PROVIDERS.find((item) => item.name === selected);
  function open(name: Provider) {
    setSources(current.connections.find((item) => item.provider === name)?.sources ?? []); setSelected(name);
  }
  function connect() {
    if (!selected || !sources.length) return;
    updateWorkspace(current.id, (item) => ({ ...item, connections: [...item.connections.filter((entry) => entry.provider !== selected), { provider: selected, sources }], stage: advanceStage(item.stage, "connections") }));
    setNotice(`${selected} preview connection added with ${sources.length} selected source${sources.length === 1 ? "" : "s"}. No external data was accessed.`); setSelected(null);
  }
  return <WorkspaceGuard workspace={current} manage>
    <SetupNav workspace={current} active="connections" />
    <PageHeading title="Connect your product tools" subtitle="Link at least one tool to continue to product documents." />
    <p className="read-only-note"><LockKeyhole size={19} /><strong>Read-only access.</strong><span>Select the projects or spaces to include.</span></p>
    {notice && <p className="success-notice" role="status">{notice}</p>}
    <div className="provider-list">{PROVIDERS.map((item) => {
      const connection = current.connections.find((entry) => entry.provider === item.name);
      return <div className="provider-row" key={item.name}><span className="provider-icon">{item.image ? <Image src={item.image} width={28} height={28} alt="" /> : <BookOpen size={25} aria-hidden="true" />}</span><div className="provider-description"><h2>{item.name}</h2><p>{item.description}</p>{connection && <p className="provider-scope">{connection.sources.join(", ")}</p>}</div><div className="provider-actions">{connection && <Badge success>Preview connected</Badge>}<button className="button secondary" onClick={() => open(item.name)}>{connection ? "Manage" : "Connect"}</button>{connection && <button className="icon-button" aria-label={`Disconnect ${item.name}`} onClick={() => setDisconnect(item.name)}><Unplug size={17} /></button>}</div></div>;
    })}</div>
    <button className="inline-link browse-more" onClick={() => setMore(true)}>Browse more integrations<Arrow /></button>
    <div className="connection-notes"><p><Info size={18} />Connections belong to {current.name}. Other workspaces cannot use them automatically.</p><p><CircleHelp size={18} />Need an administrator? You can return to your dashboard and finish later.</p></div>
    <div className="action-bar setup-actions"><Link className="text-button" href={workspacePath(current.id, "invite")}><ArrowLeft size={18} />Back</Link><div><Link className="text-button" href="/">Return to dashboard</Link><div className="action-with-note">{hasScopedConnection(current) ? <Link className="button primary" href={workspacePath(current.id, "documents")} onClick={() => updateWorkspace(current.id, (item) => ({ ...item, stage: advanceStage(item.stage, "documents") }))}>Continue to documents<Arrow /></Link> : <button className="button primary" disabled aria-describedby="connection-needed">Continue to documents</button>}{!hasScopedConnection(current) && <p id="connection-needed" className="helper">Connect at least one tool to continue.</p>}</div></div></div>
    {provider && <Modal title={`Connect ${provider.name}`} onClose={() => setSelected(null)}><p>This preview simulates a read-only connection. It does not sign in to {provider.name} or read external data.</p><fieldset className="source-options"><legend>Choose sample {provider.name === "Confluence" ? "spaces" : "projects"} for {current.name}</legend>{provider.options.map((source) => <label key={source}><input type="checkbox" checked={sources.includes(source)} onChange={(event) => setSources((items) => event.target.checked ? [...items, source] : items.filter((item) => item !== source))} /><span>{source}</span></label>)}</fieldset><p className="helper">Only selected sources belong to this workspace. A production connection will require provider authorization and source access checks.</p><div className="dialog-actions"><button className="text-button" onClick={() => setSelected(null)}>Cancel</button><button className="button primary" disabled={!sources.length} onClick={connect}><Check size={17} />Add preview connection</button></div></Modal>}
    {disconnect && <Modal title={`Disconnect ${disconnect}?`} onClose={() => setDisconnect(null)}><p>This removes the preview connection and selected sources from {current.name} only.</p><div className="dialog-actions"><button className="text-button" onClick={() => setDisconnect(null)}>Cancel</button><button className="button primary" onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, connections: item.connections.filter((entry) => entry.provider !== disconnect) })); setDisconnect(null); }}>Disconnect</button></div></Modal>}
    {more && <Modal title="More integrations" onClose={() => setMore(false)}><p>Jira, Confluence, and Linear are available as interactive previews. Additional providers will appear here when they are supported.</p><p className="helper">Need context from another tool? Export its product documents and add them on the Documents page after connecting a supported preview tool.</p><div className="dialog-actions"><button className="button primary" onClick={() => setMore(false)}>Back to connections</button></div></Modal>}
  </WorkspaceGuard>;
}
