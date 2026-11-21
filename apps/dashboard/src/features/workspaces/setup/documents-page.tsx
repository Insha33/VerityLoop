"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, Check, FileText, LockKeyhole, Upload } from "lucide-react";
import { Arrow } from "@/components/ui";
import { PageHeading } from "@/components/app-shell";
import { advanceStage, formatSize, hasScopedConnection, workspacePath, type ProductDocument } from "@/features/workspaces/model";
import { SetupNav, useWorkspace, WorkspaceGuard } from "@/features/workspaces/workspace-frame";

const ALLOWED = new Set(["pdf", "docx", "pptx", "md", "markdown", "txt"]);
const MAX_BYTES = 20 * 1024 * 1024;
export function DocumentsPage() {
  const { workspace, updateWorkspace } = useWorkspace();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  if (!workspace) return <WorkspaceGuard />;
  const current = workspace;
  function addFiles(files: FileList | null) {
    if (!files) return;
    const failures: string[] = [];
    const additions: ProductDocument[] = [];
    for (const file of Array.from(files)) {
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
    if (input.current) input.current.value = "";
  }
  function drop(event: DragEvent) { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }
  if (!hasScopedConnection(current)) return <WorkspaceGuard workspace={current} manage><PageHeading title="Connect a product tool first" subtitle="Select at least one source before adding supporting documents." /><Link className="button primary" href={workspacePath(current.id, "connections")}>Go to connections<Arrow /></Link></WorkspaceGuard>;
  return <WorkspaceGuard workspace={current} manage>
    <SetupNav workspace={current} active="documents" />
    <PageHeading title="Add context about your product" subtitle="Upload documents that explain what your product does and how it works." />
    <p className="document-examples">PRDs, TDDs, architecture, roadmaps, strategy, or customer research.</p>
    <div className={`drop-zone${dragging ? " is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}>
      <Upload size={28} aria-hidden="true" /><h2>Drag documents here</h2><button className="button secondary" onClick={() => input.current?.click()}>Browse files</button><p className="helper" id="file-formats">PDF, DOCX, PPTX, Markdown and TXT · Up to 20 MB per file</p>
      <input ref={input} className="sr-only" type="file" accept=".pdf,.docx,.pptx,.md,.markdown,.txt" multiple aria-label="Choose supporting product documents" aria-describedby="file-formats" onChange={(event) => addFiles(event.target.files)} />
    </div>
    {errors.length > 0 && <div className="file-errors" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
    {notice && <p className="helper upload-status" role="status">{notice}</p>}
    <ul className="file-list" aria-label="Product documents">{current.documents.map((file) => <li key={file.id}><FileText size={24} aria-hidden="true" /><div className="file-name"><strong title={file.name}>{file.name}</strong><span>{file.type} · {formatSize(file.size)}</span></div><span className="file-state"><Check size={15} />Added locally</span><button className="inline-link" aria-label={`Remove ${file.name}`} onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, documents: item.documents.filter((entry) => entry.id !== file.id) })); setNotice(`${file.name} removed from this workspace preview.`); }}>Remove</button></li>)}</ul>
    <div className="document-notes"><p>You can add more documents later.</p><p><LockKeyhole size={18} aria-hidden="true" />Files belong to {current.name} and follow its access permissions.</p><p className="helper">This preview keeps file names and sizes in this browser tab. Files are not uploaded or analyzed.</p></div>
    <div className="action-bar setup-actions"><Link className="text-button" href={workspacePath(current.id, "connections")}><ArrowLeft size={18} />Back</Link><button className="button primary" onClick={() => { updateWorkspace(current.id, (item) => ({ ...item, stage: advanceStage(item.stage, "complete") })); router.push(workspacePath(current.id)); }}>Finish workspace setup<Arrow /></button></div>
  </WorkspaceGuard>;
}
