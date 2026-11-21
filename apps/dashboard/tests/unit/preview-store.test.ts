import { describe, expect, it } from "vitest";
import { EMPTY_STATE, initialDemoState } from "@/lib/preview-store";

describe("initialDemoState", () => {
  it("seeds a company account with one locked, one requested and one Reviewer workspace", () => {
    const state = initialDemoState("alex@acme.com");
    expect(state.profile?.organization).toBe("Acme");
    expect(state.workspaces.map(({ id, role, requested, stage }) => ({ id, role, requested, stage }))).toEqual([
      { id: "sample-core", role: null, requested: false, stage: "invite" },
      { id: "sample-analytics", role: null, requested: true, stage: "invite" },
      { id: "sample-developer", role: "Reviewer", requested: false, stage: "complete" },
    ]);
  });
  it("starts a personal account with no workspaces", () => {
    expect(initialDemoState("alex@gmail.com").workspaces).toEqual([]);
  });
  it("signs out to an empty state", () => {
    expect(EMPTY_STATE).toEqual({ profile: null, workspaces: [] });
  });
});
