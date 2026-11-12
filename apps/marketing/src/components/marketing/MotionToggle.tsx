"use client";

import { Pause, Play } from "lucide-react";
import { setBackgroundMotionPaused, useBackgroundMotionPaused, usePrefersReducedMotion } from "./backgroundMotion";

/** Pauses every decorative background animation on the page. Hidden when motion is already reduced. */
export function MotionToggle() {
  const paused = useBackgroundMotionPaused();
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <button className="motion-toggle" type="button" onClick={() => setBackgroundMotionPaused(!paused)} aria-pressed={paused} aria-label="Pause background animation">
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  );
}
