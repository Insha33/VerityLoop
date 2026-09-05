"use client";

import { useRef, useState } from "react";
import { FileText, Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { marketingCopy } from "@/content/marketing";

const sources = [
  ...marketingCopy.context.sources,
  { name: "Your context", icon: "", use: "Bring your sources together for product decisions" },
];

export function ContextSources() {
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const pointerStart = useRef<{ name: string; wasOpen: boolean } | null>(null);

  return (
    <TooltipProvider delayDuration={180} skipDelayDuration={100}>
      <div className="sources-grid" role="group" aria-label="Explore product context sources">
        {sources.map((source) => (
          <Tooltip
            key={source.name}
            open={activeSource === source.name}
            onOpenChange={(open) => setActiveSource((current) =>
              open ? source.name : current === source.name ? null : current
            )}
          >
            <TooltipTrigger asChild>
              <button
                className={`source-item${source.name === "Your context" ? " source-context" : ""}`}
                type="button"
                onPointerDown={() => {
                  pointerStart.current = { name: source.name, wasOpen: activeSource === source.name };
                }}
                onPointerCancel={() => { pointerStart.current = null; }}
                onKeyDown={() => { pointerStart.current = null; }}
                onClick={(event) => {
                  // Keep tap/Enter toggling available; Radix otherwise closes on click.
                  event.preventDefault();
                  // Touch can focus after pointerup, opening the tooltip before click.
                  const wasOpen = pointerStart.current?.name === source.name
                    ? pointerStart.current.wasOpen
                    : activeSource === source.name;
                  pointerStart.current = null;
                  setActiveSource(wasOpen ? null : source.name);
                }}
              >
                {source.icon ? (
                  <img src={source.icon} alt="" width="26" height="26" loading="lazy" />
                ) : source.name === "Your context" ? (
                  <Link2 aria-hidden="true" />
                ) : (
                  <FileText aria-hidden="true" />
                )}
                <span>{source.name}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="source-tooltip" side="top" sideOffset={10} collisionPadding={16}>
              <strong>{source.name}</strong>
              <span>{source.use}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
