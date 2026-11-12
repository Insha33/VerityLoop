"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useBackgroundMotionPaused, usePrefersReducedMotion } from "./backgroundMotion";
import styles from "./SignalGrid.module.css";

type Variant = "hero" | "band" | "panel";

type SignalGridProps = {
  variant: Variant;
  /** Cell pitch in CSS pixels; the hairline grid and lit cells share it. */
  cell?: number;
  /** Relative amount of activity; 1 is the hero's rate. */
  density?: number;
  /** Light cells under a mouse pointer moving over the parent section. */
  interactive?: boolean;
  className?: string;
};

// Tints are brand colours at low strength: coral leads, cobalt and ink stay faint.
const TINTS: Array<{ rgb: string; max: number; weight: number }> = [
  { rgb: "255 90 79", max: 0.55, weight: 0.48 },
  { rgb: "255 150 138", max: 0.4, weight: 0.24 },
  { rgb: "39 104 255", max: 0.22, weight: 0.14 },
  { rgb: "16 22 35", max: 0.08, weight: 0.14 },
];
const ALPHA_STEPS = 24;
const PALETTE = TINTS.map(({ rgb, max }) =>
  Array.from({ length: ALPHA_STEPS + 1 }, (_, step) => `rgb(${rgb} / ${((step / ALPHA_STEPS) * max).toFixed(3)})`),
);
const FRAME_MS = 1000 / 30;
const DECAY_MS = 1500;

type Drop = { col: number; row: number; left: number; tint: number; stepMs: number; wait: number };

function pickTint() {
  let roll = Math.random();
  for (let index = 0; index < TINTS.length; index++) {
    roll -= TINTS[index].weight;
    if (roll <= 0) return index;
  }
  return 0;
}

/**
 * Decorative canvas of hairline cells that light up like signals arriving.
 * Short "drops" fall a few cells and fade, echoing evidence settling into place.
 * Runs only while on screen, the tab is visible, motion is allowed and not paused.
 */
export function SignalGrid({ variant, cell = 28, density = 1, interactive = false, className }: SignalGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paused = useBackgroundMotionPaused();
  const reduced = usePrefersReducedMotion();
  const stateRef = useRef({ paused, reduced });
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.("2d") ?? null;
    if (!root || !canvas || !context) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let intensity = new Float32Array(0);
    let tint = new Uint8Array(0);
    let drops: Drop[] = [];
    let frame = 0;
    let last = 0;
    let spawnDebt = 0;
    let onScreen = false;
    let pointer: { x: number; y: number } | null = null;

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Centre the grid so both sides of a symmetric layout match.
      offsetX = ((width / 2) % cell) - cell;
      root.style.setProperty("--grid-x", `${offsetX}px`);
      cols = Math.ceil((width - offsetX) / cell);
      rows = Math.ceil(height / cell);
      intensity = new Float32Array(cols * rows);
      tint = new Uint8Array(cols * rows);
      drops = [];
      seed(Math.round(cols * rows * 0.06));
      draw();
    };

    const light = (col: number, row: number, value: number, colour: number) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return;
      const index = row * cols + col;
      if (value > intensity[index]) {
        intensity[index] = value;
        tint[index] = colour;
      }
    };

    const seed = (count: number) => {
      for (let index = 0; index < count; index++) {
        light(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 0.25 + Math.random() * 0.6, pickTint());
      }
    };

    const spawn = () => {
      const left = 2 + Math.floor(Math.random() * 4);
      drops.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * Math.max(1, rows - left)),
        left,
        tint: pickTint(),
        stepMs: 120 + Math.random() * 110,
        wait: 0,
      });
    };

    const step = (elapsed: number) => {
      const decay = Math.exp(-elapsed / DECAY_MS);
      for (let index = 0; index < intensity.length; index++) intensity[index] *= decay;

      spawnDebt += (elapsed / 1000) * density * Math.max(1, (cols * rows) / 180);
      while (spawnDebt >= 1) { spawn(); spawnDebt -= 1; }

      drops = drops.filter((drop) => {
        drop.wait -= elapsed;
        if (drop.wait > 0) return true;
        light(drop.col, drop.row, 0.55 + Math.random() * 0.45, drop.tint);
        drop.row += 1;
        drop.left -= 1;
        drop.wait = drop.stepMs;
        return drop.left > 0 && drop.row < rows;
      });

      if (pointer) {
        const col = Math.floor((pointer.x - offsetX) / cell);
        const row = Math.floor(pointer.y / cell);
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const reach = 1 - Math.hypot(dx, dy) / 3;
            if (reach > 0) light(col + dx, row + dy, reach * 0.7, 0);
          }
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const value = intensity[index];
          if (value < 0.03) continue;
          context.fillStyle = PALETTE[tint[index]][Math.min(ALPHA_STEPS, Math.round(value * ALPHA_STEPS))];
          context.fillRect(offsetX + col * cell + 1, row * cell + 1, cell - 1, cell - 1);
        }
      }
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < FRAME_MS) return;
      last = now;
      step(Math.min(elapsed, 100));
      draw();
    };

    const shouldRun = () => onScreen && !document.hidden && !stateRef.current.paused && !stateRef.current.reduced;
    const start = () => {
      if (frame || !shouldRun()) return;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => (shouldRun() ? start() : stop());
    startRef.current = sync;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const visibility = new IntersectionObserver((entries) => { onScreen = entries[entries.length - 1].isIntersecting; sync(); }, { rootMargin: "120px 0px" });
    visibility.observe(root);
    document.addEventListener("visibilitychange", sync);

    const host = interactive ? root.parentElement : null;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = root.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const leave = () => { pointer = null; };
    host?.addEventListener("pointermove", move, { passive: true });
    host?.addEventListener("pointerleave", leave);

    resize();
    sync();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      host?.removeEventListener("pointermove", move);
      host?.removeEventListener("pointerleave", leave);
      startRef.current = () => {};
    };
  }, [cell, density, interactive]);

  // Pause and reduced-motion changes start or freeze the loop without rebuilding the grid.
  useEffect(() => {
    stateRef.current = { paused, reduced };
    startRef.current();
  }, [paused, reduced]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ""}`} data-variant={variant} style={{ "--cell": `${cell}px` } as CSSProperties} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
