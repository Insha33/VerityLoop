"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleHelp, Info, LockKeyhole, Unplug } from "lucide-react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { CheckboxList, CheckboxListItem } from "@astryxdesign/core/CheckboxList";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
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
    <p className="read-only-note"><LockKeyhole size={19} aria-hidden="true" /><strong>Read-only access.</strong><span>Select the projects or spaces to include.</span></p>
    {notice && <p className="success-notice" role="status">{notice}</p>}
    <div className="provider-list">{PROVIDERS.map((item) => {
      const connection = current.connections.find((entry) => entry.provider === item.name);
      return <div className="provider-row" key={item.name}><span className="provider-icon">{item.image ? <Image src={item.image} width={28} height={28} alt="" /> : <BookOpen size={25} aria-hidden="true" />}</span><div className="provider-description"><h2>{item.name}</h2><p>{item.description}</p>{connection && <p className="provider-scope">{connection.sources.join(", ")}</p>}</div><div className="provider-actions">{connection && <Badge variant="success" icon={<Icon icon={Check} size="xsm" />} label="Preview connected" />}<Button size="lg" label={connection ? "Manage" : "Connect"} onClick={() => open(item.name)} />{connection && <IconButton variant="ghost" label={`Disconnect ${item.name}`} icon={<Icon icon={Unplug} />} onClick={() => setDisconnect(item.name)} />}</div></div>;
    })}</div>
    <div className="browse-more"><Button variant="ghost" label="Browse more integrations" endContent={<Icon icon={ArrowRight} />} onClick={() => setMore(true)} /></div>
    <div className="connection-notes"><p><Info size={18} aria-hidden="true" />Connections belong to {current.name}. Other workspaces cannot use them automatically.</p><p><CircleHelp size={18} aria-hidden="true" />Need an administrator? You can return to your dashboard and finish later.</p></div>
    <div className="action-bar setup-actions"><Button variant="ghost" href={workspacePath(current.id, "invite")} label="Back" icon={<Icon icon={ArrowLeft} />} /><div><Button variant="ghost" size="lg" href="/" label="Return to dashboard" /><div className="action-with-note">{hasScopedConnection(current) ? <Button variant="primary" size="lg" href={workspacePath(current.id, "documents")} onClick={() => updateWorkspace(current.id, (item) => ({ ...item, stage: advanceStage(item.stage, "documents") }))} label="Continue to documents" endContent={<Icon icon={ArrowRight} />} /> : <Button variant="primary" size="lg" isDisabled label="Continue to documents" aria-describedby="connection-needed" />}{!hasScopedConnection(current) && <p id="connection-needed" className="helper">Connect at least one tool to continue.</p>}</div></div></div>
    <Dialog isOpen={provider !== undefined} onOpenChange={(isOpen) => { if (!isOpen) setSelected(null); }} width={560}>
      {provider && <>
        <DialogHeader title={`Connect ${provider.name}`} onOpenChange={() => setSelected(null)} />
        <VStack gap={4} padding={4}>
          <Text>This preview simulates a read-only connection. It does not sign in to {provider.name} or read external data.</Text>
          <CheckboxList label={`Choose sample ${provider.name === "Confluence" ? "spaces" : "projects"} for ${current.name}`} value={sources} onChange={setSources} hasDividers>
            {provider.options.map((source) => <CheckboxListItem key={source} value={source} label={source} />)}
          </CheckboxList>
          <Text type="supporting" color="secondary">Only selected sources belong to this workspace. A production connection will require provider authorization and source access checks.</Text>
          <HStack gap={2} justify="end"><Button variant="ghost" label="Cancel" onClick={() => setSelected(null)} /><Button variant="primary" isDisabled={!sources.length} label="Add preview connection" icon={<Icon icon={Check} />} onClick={connect} /></HStack>
        </VStack>
      </>}
    </Dialog>
    <Dialog isOpen={disconnect !== null} onOpenChange={(isOpen) => { if (!isOpen) setDisconnect(null); }}>
      <DialogHeader title={`Disconnect ${disconnect ?? ""}?`} onOpenChange={() => setDisconnect(null)} />
      <VStack gap={6} padding={4}>
        <Text>This removes the preview connection and selected sources from {current.name} only.</Text>
        <HStack gap={2} justify="end"><Button variant="ghost" label="Cancel" onClick={() => setDisconnect(null)} /><Button variant="destructive" label="Disconnect" onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, connections: item.connections.filter((entry) => entry.provider !== disconnect) })); setDisconnect(null); }} /></HStack>
      </VStack>
    </Dialog>
    <Dialog isOpen={more} onOpenChange={setMore} width={560}>
      <DialogHeader title="More integrations" onOpenChange={setMore} />
      <VStack gap={4} padding={4}>
        <Text>Jira, Confluence, and Linear are available as interactive previews. Additional providers will appear here when they are supported.</Text>
        <Text type="supporting" color="secondary">Need context from another tool? Export its product documents and add them on the Documents page after connecting a supported preview tool.</Text>
        <HStack justify="end"><Button variant="primary" label="Back to connections" onClick={() => setMore(false)} /></HStack>
      </VStack>
    </Dialog>
  </WorkspaceGuard>;
}
