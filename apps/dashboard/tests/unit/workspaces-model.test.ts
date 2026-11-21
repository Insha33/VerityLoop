import { describe, expect, it } from "vitest";
import {
  advanceStage, canManage, canOpen, formatSize, hasScopedConnection,
  newWorkspace, validateInvitations, workspacePath, type Workspace,
} from "@/features/workspaces/model";

const workspace = (overrides: Partial<Workspace> = {}): Workspace => ({ ...newWorkspace("w1", "Core", "Acme"), ...overrides });

describe("advanceStage", () => {
  it("moves forward to a later stage", () => {
    expect(advanceStage("invite", "connections")).toBe("connections");
    expect(advanceStage("connections", "complete")).toBe("complete");
  });
  it("never moves backwards when an earlier step is revisited", () => {
    expect(advanceStage("complete", "connections")).toBe("complete");
    expect(advanceStage("documents", "invite")).toBe("documents");
  });
  it("keeps the stage when it is the same", () => {
    expect(advanceStage("documents", "documents")).toBe("documents");
  });
});

describe("newWorkspace", () => {
  it("makes the creator Owner and starts setup at invite", () => {
    expect(newWorkspace("id", "  Core Platform  ", "Acme")).toMatchObject({
      id: "id", name: "Core Platform", organization: "Acme", role: "Owner", requested: false, stage: "invite",
      invitations: [], connections: [], documents: [], inviteLink: null,
    });
  });
  it("rejects empty and over-long names", () => {
    expect(() => newWorkspace("id", "   ", null)).toThrow(/between 1 and 80/);
    expect(() => newWorkspace("id", "x".repeat(81), null)).toThrow(/between 1 and 80/);
    expect(newWorkspace("id", "x".repeat(80), null).name).toHaveLength(80);
  });
});

describe("role checks (UI only, not a security boundary)", () => {
  it("lets any member open but only the Owner manage", () => {
    expect([canOpen(workspace({ role: "Owner" })), canManage(workspace({ role: "Owner" }))]).toEqual([true, true]);
    expect([canOpen(workspace({ role: "Editor" })), canManage(workspace({ role: "Editor" }))]).toEqual([true, false]);
    expect([canOpen(workspace({ role: "Reviewer" })), canManage(workspace({ role: "Reviewer" }))]).toEqual([true, false]);
    expect([canOpen(workspace({ role: null })), canManage(workspace({ role: null }))]).toEqual([false, false]);
  });
});

describe("hasScopedConnection", () => {
  it("needs at least one connection with a selected source", () => {
    expect(hasScopedConnection(workspace())).toBe(false);
    expect(hasScopedConnection(workspace({ connections: [{ provider: "Jira", sources: [] }] }))).toBe(false);
    expect(hasScopedConnection(workspace({ connections: [{ provider: "Jira", sources: [] }, { provider: "Linear", sources: ["Web"] }] }))).toBe(true);
  });
});

describe("workspacePath", () => {
  it("builds workspace URLs without the old /app prefix and encodes the id", () => {
    expect(workspacePath("sample-core")).toBe("/workspaces/sample-core");
    expect(workspacePath("sample-core", "connections")).toBe("/workspaces/sample-core/connections");
    expect(workspacePath("a b/c")).toBe("/workspaces/a%20b%2Fc");
  });
});

describe("validateInvitations", () => {
  const own = "alex@acme.com";
  it("accepts no invitations, since inviting is optional", () => {
    expect(validateInvitations([{ email: "  ", role: "Editor" }], own)).toBeNull();
  });
  it("accepts valid colleagues", () => {
    expect(validateInvitations([{ email: "sam@acme.com", role: "Editor" }, { email: "kim@acme.com", role: "Reviewer" }], own)).toBeNull();
  });
  it("rejects an invalid address", () => {
    expect(validateInvitations([{ email: "sam@", role: "Editor" }], own)).toMatch(/valid email/);
  });
  it("rejects inviting yourself, ignoring case and spaces", () => {
    expect(validateInvitations([{ email: "  ALEX@acme.com ", role: "Editor" }], own)).toMatch(/already the workspace owner/);
  });
  it("rejects duplicates, ignoring case and spaces", () => {
    expect(validateInvitations([{ email: "sam@acme.com", role: "Editor" }, { email: " SAM@acme.com", role: "Reviewer" }], own)).toMatch(/duplicate/);
  });
});

describe("formatSize", () => {
  it("shows KB below 1 MB with a 1 KB floor, and MB with one decimal above", () => {
    expect(formatSize(10)).toBe("1 KB");
    expect(formatSize(2048)).toBe("2 KB");
    expect(formatSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatSize(5.25 * 1024 * 1024)).toBe("5.3 MB");
  });
});
