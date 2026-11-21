"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, LockKeyhole } from "lucide-react";
import { Button } from "@astryxdesign/core/Button";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Icon } from "@astryxdesign/core/Icon";
import { PageHeading } from "@/components/app-shell";
import { advanceStage, formatSize, hasScopedConnection, workspacePath, type ProductDocument } from "@/features/workspaces/model";
import { SetupNav, useWorkspace, WorkspaceGuard } from "@/features/workspaces/workspace-frame";

const ALLOWED = new Set(["pdf", "docx", "pptx", "md", "markdown", "txt"]);
const MAX_BYTES = 20 * 1024 * 1024;
export function DocumentsPage() {
  const { workspace, updateWorkspace } = useWorkspace();
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  if (!workspace) return <WorkspaceGuard />;
  const current = workspace;
  function addFiles(selection: File | File[] | null) {
    const files = selection === null ? [] : Array.isArray(selection) ? selection : [selection];
    if (!files.length) return;
    const failures: string[] = [];
    const additions: ProductDocument[] = [];
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED.has(extension)) { failures.push(`${file.name}: choose PDF, DOCX, PPTX, Markdown, or TXT.`); continue; }
      if (!file.size) { failures.push(`${file.name}: this file is empty. Choose a file with content.`); continue; }
      if (file.size > MAX_BYTES) { failures.push(`${file.name}: use a file smaller than 20 MB.`); continue; }
      if ([...current.documents, ...additions].some((item) => item.name === file.name && item.size === file.size)) { failures.push(`${file.name}: this file is already in the list.`); continue; }
      additions.push({ id: crypto.randomUUID(), name: file.name, size: file.size, type: extension.toUpperCase() });
    }
    updateWorkspace(current.id, (item) => ({ ...item, documents: [...item.documents, ...additions] }));
    setErrors(failures);
    setNotice(additions.length ? `${additions.length} file${additions.length === 1 ? "" : "s"} added to this preview. No file contents were uploaded.` : "");
  }
  if (!hasScopedConnection(current)) return <WorkspaceGuard workspace={current} manage><PageHeading title="Connect a product tool first" subtitle="Select at least one source before adding supporting documents." /><Button variant="primary" size="lg" href={workspacePath(current.id, "connections")} label="Go to connections" endContent={<Icon icon={ArrowRight} />} /></WorkspaceGuard>;
  return <WorkspaceGuard workspace={current} manage>
    <SetupNav workspace={current} active="documents" />
    <PageHeading title="Add context about your product" subtitle="Upload documents that explain what your product does and how it works." />
    <p className="document-examples">PRDs, TDDs, architecture, roadmaps, strategy, or customer research.</p>
    <FileInput mode="dropzone" isMultiple label="Choose supporting product documents" isLabelHidden placeholder="Drag documents here" value={null} onChange={addFiles} status={errors.length ? { type: "error" } : undefined} aria-describedby="file-formats" />
    <p id="file-formats" className="helper drop-zone-formats">PDF, DOCX, PPTX, Markdown and TXT · Up to 20 MB per file</p>
    {errors.length > 0 && <div className="file-errors" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
    {notice && <p className="helper upload-status" role="status">{notice}</p>}
    <ul className="file-list" aria-label="Product documents">{current.documents.map((file) => <li key={file.id}><FileText size={24} aria-hidden="true" /><div className="file-name"><strong title={file.name}>{file.name}</strong><span>{file.type} · {formatSize(file.size)}</span></div><span className="file-state"><Check size={15} aria-hidden="true" />Added locally</span><Button variant="ghost" size="sm" label={`Remove ${file.name}`} onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, documents: item.documents.filter((entry) => entry.id !== file.id) })); setNotice(`${file.name} removed from this workspace preview.`); }}>Remove</Button></li>)}</ul>
    <div className="document-notes"><p>You can add more documents later.</p><p><LockKeyhole size={18} aria-hidden="true" />Files belong to {current.name} and follow its access permissions.</p><p className="helper">This preview keeps file names and sizes in this browser tab. Files are not uploaded or analyzed.</p></div>
    <div className="action-bar setup-actions"><Button variant="ghost" href={workspacePath(current.id, "connections")} label="Back" icon={<Icon icon={ArrowLeft} />} /><Button variant="primary" size="lg" label="Finish workspace setup" endContent={<Icon icon={ArrowRight} />} onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, stage: advanceStage(item.stage, "complete") })); router.push(workspacePath(current.id)); }} /></div>
  </WorkspaceGuard>;
}
