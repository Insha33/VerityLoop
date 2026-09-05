"use client";

import { NotebookPen } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { marketingCopy } from "@/content/marketing";

import styles from "./ContextOrbit.module.css";

type ContextSource = (typeof marketingCopy.context.sources)[number];

const orbitPattern = [3, 2, 1, 3, 2, 1, 3, 2, 1, 3, 2] as const;
const orbitRadius = { 1: 19, 2: 31, 3: 43 } as const;
const scanDurationMs = 16500;

const radarSources = marketingCopy.context.sources.map((source, index, sources) => ({
  ...source,
  orbit: orbitPattern[index],
  angle: -90 + (index * 360) / sources.length,
}));

function SourceIcon({ source }: { source: ContextSource }) {
  return (
    <span className={styles.sourceIcon} aria-hidden="true">
      {source.icon ? (
        <>
          <span className={styles.iconFallback}>{source.initials}</span>
          <img
            src={source.icon}
            width="30"
            height="30"
            loading="lazy"
            decoding="async"
            alt=""
          />
        </>
      ) : (
        <NotebookPen className={styles.notesIcon} />
      )}
    </span>
  );
}

export function ContextOrbit() {
  const { context } = marketingCopy;
  const sweepRef = useRef<HTMLDivElement>(null);
  const activeScanRef = useRef<string | null>(null);
  const [activeScanName, setActiveScanName] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const updateActiveSource = () => {
      const sweepAnimation = sweepRef.current?.getAnimations?.()[0];

      if (sweepAnimation) {
        const elapsed = Number(sweepAnimation.currentTime ?? 0);
        const progress =
          (((elapsed % scanDurationMs) + scanDurationMs) % scanDurationMs) /
          scanDurationMs;
        const sweepAngle = -90 + progress * 360;
        let closestName: string | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        for (const source of radarSources) {
          const distance = Math.abs(
            ((((sweepAngle - source.angle) % 360) + 540) % 360) - 180,
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestName = source.name;
          }
        }

        const nextName = closestDistance <= 7 ? closestName : null;
        if (nextName !== activeScanRef.current) {
          activeScanRef.current = nextName;
          setActiveScanName(nextName);
        }
      }

      frameId = window.requestAnimationFrame(updateActiveSource);
    };

    frameId = window.requestAnimationFrame(updateActiveSource);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="section context-section" aria-labelledby="context-title">
      <div className="shell context-layout">
        <div className={styles.contextCopy} data-reveal>
          <p className="eyebrow">{context.eyebrow}</p>
          <h2 id="context-title">{context.title}</h2>
          <p>{context.description}</p>
        </div>

        <div
          className={styles.radarCanvas}
          data-reveal
          aria-label="Permissioned product context sources"
        >
          <div className={styles.radarStage}>
            <div className={styles.radarRings} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <div className={styles.radarHub} aria-label="VerityLoop context layer">
              <span className={styles.verityMark} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>

            {radarSources.map((source) => {
              const radians = source.angle * (Math.PI / 180);
              const radius = orbitRadius[source.orbit];
              const horizontalDirection = Math.cos(radians);
              const tooltipBelow = Math.sin(radians) < -0.55;
              const tooltipDirection =
                horizontalDirection < -0.35
                  ? styles.tooltipInwardRight
                  : horizontalDirection > 0.35
                    ? styles.tooltipInwardLeft
                    : "";
              const nodeStyle = {
                "--node-x": `${Math.cos(radians) * radius}%`,
                "--node-y": `${Math.sin(radians) * radius}%`,
              } as CSSProperties;

              return (
                <div
                  className={`${styles.radarNode} ${
                    activeScanName === source.name ? styles.radarNodeScanActive : ""
                  } ${tooltipBelow ? styles.tooltipBelow : ""} ${tooltipDirection}`}
                  key={source.name}
                  style={nodeStyle}
                  tabIndex={0}
                  role="img"
                  aria-label={`${source.name}. ${source.use}`}
                >
                  <SourceIcon source={source} />
                  <span className={styles.scanTooltip} aria-hidden="true">
                    {source.use}
                  </span>
                  <span className={styles.nameTooltip} aria-hidden="true">
                    {source.name}
                  </span>
                </div>
              );
            })}

            <div className={styles.radarSweep} ref={sweepRef} aria-hidden="true">
              <i />
            </div>
          </div>

          <span className={styles.radarStatus}>
            {radarSources.length} permissioned sources
          </span>
        </div>
      </div>
    </section>
  );
}
