"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { profileForEmail, type Profile } from "@/features/auth/profile";
import { newWorkspace, type Workspace } from "@/features/workspaces/model";

export type DemoState = { profile: Profile | null; workspaces: Workspace[] };
export const EMPTY_STATE: DemoState = { profile: null, workspaces: [] };

export function initialDemoState(value: string): DemoState {
  const profile = profileForEmail(value);
  const samples: Workspace[] = profile.organization ? [
    { ...newWorkspace("sample-core", "Core Platform", profile.organization), role: null },
    { ...newWorkspace("sample-analytics", "Analytics", profile.organization), role: null, requested: true },
    { ...newWorkspace("sample-developer", "Developer Experience", profile.organization), role: "Reviewer", stage: "complete" },
  ] : [];
  return { profile, workspaces: samples };
}

const STORAGE_KEY = "verityloop-product-preview-v1";
type Store = {
  state: DemoState; ready: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, update: (workspace: Workspace) => Workspace) => void;
};
const Context = createContext<Store | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DemoState;
        if (parsed.profile && Array.isArray(parsed.workspaces)) setState(parsed);
      }
    } catch { /* A blocked or old session starts a fresh preview. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Preview remains usable without storage. */ }
  }, [state, ready]);
  const value: Store = {
    state, ready,
    signIn: (email) => setState((previous) => previous.profile?.email === email.trim().toLowerCase() ? previous : initialDemoState(email)),
    signOut: () => setState(EMPTY_STATE),
    addWorkspace: (workspace) => setState((previous) => ({ ...previous, workspaces: [...previous.workspaces, workspace] })),
    updateWorkspace: (id, update) => setState((previous) => ({ ...previous,
      workspaces: previous.workspaces.map((workspace) => workspace.id === id ? update(workspace) : workspace),
    })),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemo() {
  const store = useContext(Context);
  if (!store) throw new Error("Use the preview store within DemoProvider.");
  return store;
}
