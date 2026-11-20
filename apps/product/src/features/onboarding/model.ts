export type Role = "Owner" | "Editor" | "Reviewer";
export type Provider = "Jira" | "Confluence" | "Linear";
export type Connection = { provider: Provider; sources: string[] };
export type ProductDocument = { id: string; name: string; size: number; type: string };
export type Invitation = { email: string; role: Exclude<Role, "Owner"> };
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
  stage: "invite" | "connections" | "documents" | "complete";
};
export type Profile = { email: string; name: string; domain: string; organization: string | null };
export type DemoState = { profile: Profile | null; workspaces: Workspace[] };
export const EMPTY_STATE: DemoState = { profile: null, workspaces: [] };

// Demo routing rules only. Production needs managed domains and verified identities.
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com", "aol.com",
  "icloud.com", "me.com", "proton.me", "protonmail.com", "mail.com", "gmx.com",
]);
export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function profileForEmail(value: string): Profile {
  const email = value.trim().toLowerCase();
  if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
  const [local, domain] = email.split("@");
  const title = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  return {
    email, domain,
    name: local.split(/[._+-]/).filter(Boolean).map(title).join(" "),
    organization: PERSONAL_DOMAINS.has(domain) ? null : title(domain.split(".")[0]),
  };
}
export function newWorkspace(id: string, name: string, organization: string | null): Workspace {
  const clean = name.trim();
  if (!clean || clean.length > 80) throw new Error("Use a workspace name between 1 and 80 characters.");
  return { id, name: clean, organization, role: "Owner", requested: false,
    invitations: [], inviteLink: null, connections: [], documents: [], stage: "invite" };
}
export function initialDemoState(value: string): DemoState {
  const profile = profileForEmail(value);
  const samples: Workspace[] = profile.organization ? [
    { ...newWorkspace("sample-core", "Core Platform", profile.organization), role: null },
    { ...newWorkspace("sample-analytics", "Analytics", profile.organization), role: null, requested: true },
    { ...newWorkspace("sample-developer", "Developer Experience", profile.organization), role: "Reviewer", stage: "complete" },
  ] : [];
  return { profile, workspaces: samples };
}
export function canOpen(workspace: Workspace) { return workspace.role !== null; }
export function canManage(workspace: Workspace) { return workspace.role === "Owner"; }
export function hasScopedConnection(workspace: Workspace) {
  return workspace.connections.some((connection) => connection.sources.length > 0);
}
export function workspacePath(id: string, section?: string) {
  return `/app/workspaces/${encodeURIComponent(id)}${section ? `/${section}` : ""}`;
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
