"use client";

import { useSyncExternalStore } from "react";

/** Tracks `prefers-reduced-motion: reduce`; assumes reduced until the client says otherwise. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (listener) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}
