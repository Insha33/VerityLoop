"use client";

import { useSyncExternalStore } from "react";

/**
 * One switch for every decorative background on the page, so a single
 * pause control (WCAG 2.2.2) stops all of them, not just the one beside it.
 */
let paused = false;
const listeners = new Set<() => void>();

export function setBackgroundMotionPaused(next: boolean) {
  if (next === paused) return;
  paused = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBackgroundMotionPaused() {
  return useSyncExternalStore(subscribe, () => paused, () => false);
}

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
