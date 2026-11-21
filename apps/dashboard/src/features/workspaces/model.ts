import { isValidEmail } from "@/lib/email";

export type Role = "Owner" | "Editor" | "Reviewer";
export type Provider = "Jira" | "Confluence" | "Linear";
export type Connection = { provider: Provider; sources: string[] };
export type ProductDocument = { id: string; name: string; size: number; type: string };
export type Invitation = { email: string; role: Exclude<Role, "Owner"> };
export type Stage = "invite" | "connections" | "documents" | "complete";
const STAGE_ORDER: readonly Stage[] = ["invite", "connections", "documents", "complete"];
/** Setup only moves forward: revisiting an earlier step never reopens a later one. */
export function advanceStage(current: Stage, next: Stage): Stage {
  return STAGE_ORDER.indexOf(next) > STAGE_ORDER.indexOf(current) ? next : current;
}
export type Workspace = {
  id: string;
  name: string;
  organization: string | null;
  role: Role | null;
  requested: boolean;
  invitations: Invitation[];
  inviteLink: { token: string; expiresAt: number } | null;
  connections: Connection[];
  documents: ProductDocument[];
  stage: Stage;
};

export function newWorkspace(id: string, name: string, organization: string | null): Workspace {
  const clean = name.trim();
  if (!clean || clean.length > 80) throw new Error("Use a workspace name between 1 and 80 characters.");
  return { id, name: clean, organization, role: "Owner", requested: false,
    invitations: [], inviteLink: null, connections: [], documents: [], stage: "invite" };
}
export function canOpen(workspace: Workspace) { return workspace.role !== null; }
export function canManage(workspace: Workspace) { return workspace.role === "Owner"; }
export function hasScopedConnection(workspace: Workspace) {
  return workspace.connections.some((connection) => connection.sources.length > 0);
}
export function workspacePath(id: string, section?: string) {
  return `/workspaces/${encodeURIComponent(id)}${section ? `/${section}` : ""}`;
}
export function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function validateInvitations(rows: Invitation[], ownEmail: string) {
  const invitations = rows.filter((row) => row.email.trim()).map((row) => ({ ...row, email: row.email.trim().toLowerCase() }));
  if (invitations.some((row) => !isValidEmail(row.email))) return "Enter a valid email address for each colleague.";
  if (invitations.some((row) => row.email === ownEmail)) return "You’re already the workspace owner. Add a colleague’s email instead.";
  if (new Set(invitations.map((row) => row.email)).size !== invitations.length) return "Each colleague only needs one invitation. Remove the duplicate email.";
  return null;
}
