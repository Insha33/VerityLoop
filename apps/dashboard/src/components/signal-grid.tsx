"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// A port of apps/marketing/src/components/marketing/SignalGrid.tsx for the sign-up stage.
// Differences: smaller cells by default, colors read from theme tokens (so light and dark both work),
// and one variant. Apps can't import each other's code; move both copies to a package if a third use appears.

/** Coral family only, weighted like marketing: brand coral, pale coral, deep coral, peach. */
const TINTS = [
  { token: "--vl-brand", max: 0.55, weight: 0.44 },
  { token: "--vl-brand-pale", max: 0.42, weight: 0.26 },
  { token: "--vl-brand-deep", max: 0.3, weight: 0.14 },
  { token: "--vl-peach", max: 0.5, weight: 0.16 },
];
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Decorative hairline grid whose cells light up like signals arriving: short drops fall a few cells
 * and fade. Square cells, no rounding. Runs only while on screen, the tab is visible and motion is
 * allowed; with reduced motion it shows the static grid and a few still cells.
 */
export function SignalGrid({ cell = 18, density = 0.8 }: { cell?: number; density?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    const context = canvas?.getContext?.("2d") ?? null;
    if (!root || !canvas || !probe || !context) return;

    let colors: string[] = [];
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

    // Resolve each token to a concrete color through a hidden probe, so light-dark() values work.
    const readColors = () => {
      colors = TINTS.map(({ token }) => {
        probe.style.color = `var(${token})`;
        return getComputedStyle(probe).color;
      });
    };

    const light = (col: number, row: number, value: number, colour: number) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return;
      const index = row * cols + col;
      if (value > intensity[index]) { intensity[index] = value; tint[index] = colour; }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const value = intensity[row * cols + col];
          if (value < 0.03) continue;
          const index = tint[row * cols + col];
          context.globalAlpha = Math.min(1, value) * TINTS[index].max;
          context.fillStyle = colors[index];
          context.fillRect(offsetX + col * cell + 1, row * cell + 1, cell - 1, cell - 1);
        }
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      offsetX = ((width / 2) % cell) - cell;
      root.style.setProperty("--grid-x", `${offsetX}px`);
      cols = Math.ceil((width - offsetX) / cell);
      rows = Math.ceil(height / cell);
      intensity = new Float32Array(cols * rows);
      tint = new Uint8Array(cols * rows);
      drops = [];
      for (let index = 0; index < Math.round(cols * rows * 0.05); index++) {
        light(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 0.25 + Math.random() * 0.6, pickTint());
      }
      draw();
    };

    const step = (elapsed: number) => {
      const decay = Math.exp(-elapsed / DECAY_MS);
      for (let index = 0; index < intensity.length; index++) intensity[index] *= decay;
      spawnDebt += (elapsed / 1000) * density * Math.max(1, (cols * rows) / 180);
      while (spawnDebt >= 1) {
        const left = 2 + Math.floor(Math.random() * 4);
        drops.push({ col: Math.floor(Math.random() * cols), row: Math.floor(Math.random() * Math.max(1, rows - left)), left, tint: pickTint(), stepMs: 120 + Math.random() * 110, wait: 0 });
        spawnDebt -= 1;
      }
      drops = drops.filter((drop) => {
        drop.wait -= elapsed;
        if (drop.wait > 0) return true;
        light(drop.col, drop.row, 0.55 + Math.random() * 0.45, drop.tint);
        drop.row += 1;
        drop.left -= 1;
        drop.wait = drop.stepMs;
        return drop.left > 0 && drop.row < rows;
      });
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < FRAME_MS) return;
      last = now;
      step(Math.min(elapsed, 100));
      draw();
    };
    const shouldRun = () => onScreen && !document.hidden && !reducedRef.current;
    const stop = () => { if (frame) window.cancelAnimationFrame(frame); frame = 0; };
    const sync = () => {
      if (!shouldRun()) { stop(); return; }
      if (frame) return;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };
    syncRef.current = sync;

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const recolor = () => { readColors(); draw(); };
    const resizeObserver = new ResizeObserver(resize);
    const visibility = new IntersectionObserver((entries) => { onScreen = entries[entries.length - 1].isIntersecting; sync(); });
    readColors();
    resizeObserver.observe(root);
    visibility.observe(root);
    document.addEventListener("visibilitychange", sync);
    scheme.addEventListener("change", recolor);
    resize();
    sync();
    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      scheme.removeEventListener("change", recolor);
      syncRef.current = () => {};
    };
  }, [cell, density]);

  useEffect(() => { reducedRef.current = reduced; syncRef.current(); }, [reduced]);

  return <div ref={rootRef} className="signal-grid" style={{ "--cell": `${cell}px` } as CSSProperties} aria-hidden="true">
    <canvas ref={canvasRef} />
    <span ref={probeRef} className="signal-probe" />
  </div>;
}
