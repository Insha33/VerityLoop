"use client";

import { useEffect, useRef, useState } from "react";

import { marketingCopy } from "@/content/marketing";

export function ContextOrbit() {
  const { context } = marketingCopy;
  const [activeSource, setActiveSource] = useState<string>(context.sources[0]);
  const userSelected = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    const interval = window.setInterval(() => {
      if (userSelected.current) return;
      index = (index + 1) % context.sources.length;
      setActiveSource(context.sources[index]);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [context.sources]);

  return (
    <section className="section context-section" aria-labelledby="context-title">
      <div className="shell context-layout">
        <div data-reveal>
          <p className="eyebrow">{context.eyebrow}</p>
          <h2 id="context-title">{context.title}</h2>
          <p>{context.description}</p>
        </div>
        <div className="context-cloud" data-reveal aria-label="Supported context sources">
          {context.sources.map((source) => (
            <button
              key={source}
              type="button"
              className={activeSource === source ? "is-active" : undefined}
              aria-pressed={activeSource === source}
              onClick={() => {
                userSelected.current = true;
                setActiveSource(source);
              }}
            >
              {source}
            </button>
          ))}
          <i>
            <strong>VerityLoop</strong>
            <small aria-live="polite">{activeSource} connected</small>
          </i>
        </div>
      </div>
    </section>
  );
}
