"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowUpRight, BadgeCheck, Check, FileText, Link2, LoaderCircle, LockKeyhole, RotateCcw, Send, Ticket } from "lucide-react";

const steps = [
  { title: "PRD drafting after a human decision", copy: "Nothing is written until the decision owner approves a direction." },
  { title: "Optional ticket drafts after PRD approval", copy: "Engineering reviews scope and prerequisites before any ticket exists." },
  { title: "Separate review before Jira or Linear publishing", copy: "Publishing is its own step, with its own approval." },
] as const;

/** Staggered entrance for one element inside the active scene. */
const at = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

function DraftScene() {
  return (
    <>
      <div className="scene-bar"><FileText aria-hidden="true" /><span>Product requirements</span><span className="scene-status" data-tone="amber"><LockKeyhole aria-hidden="true" />Draft for review</span></div>
      <div className="scene-body">
        <div className="scene-banner scene-in" style={at(60)}><BadgeCheck aria-hidden="true" /><span><strong>Decision DEC-014 approved</strong>Validate demand before accelerating</span></div>
        <span className="scene-meta scene-in" style={at(200)}>PRD-014 · Shared approvals</span>
        <h4 className="scene-title scene-in" style={at(280)}>Validate demand.<br />Review the prerequisites.</h4>
        <p className="scene-copy scene-in" style={at(380)}>Test whether a shared approval queue solves a recurring customer problem before accelerating the initiative.</p>
        <span className="scene-subhead scene-in" style={at(500)}>Acceptance criteria</span>
        {["Confirm approval bottlenecks with five customers", "Ask engineering to review audit-history prerequisites", "Record scope, exclusions, and unresolved questions"].map((item, index) => (
          <div className="scene-row scene-in" style={at(580 + index * 110)} key={item}><span className="scene-box" />{item}</div>
        ))}
        <div className="scene-foot scene-in" style={at(950)}><Link2 aria-hidden="true" />4 sources attached<span>Decision DEC-014</span></div>
      </div>
    </>
  );
}

const tickets = [
  { title: "Interview five customers about approval bottlenecks", tag: "Research" },
  { title: "Review audit-history prerequisites", tag: "Engineering" },
  { title: "Scope a shared approval queue pilot", tag: "Product" },
];

function TicketScene() {
  return (
    <>
      <div className="scene-bar"><Ticket aria-hidden="true" /><span>Ticket drafts</span><span className="scene-status">From PRD-014</span></div>
      <div className="scene-body">
        <div className="scene-banner scene-in" style={at(60)}><BadgeCheck aria-hidden="true" /><span><strong>PRD-014 approved</strong>Reviewed by product and engineering</span></div>
        <span className="scene-subhead scene-in" style={at(220)}>Drafted from the approved scope</span>
        {tickets.map((ticket, index) => (
          <div className="scene-ticket scene-in" style={at(320 + index * 140)} key={ticket.title}>
            <span className="ticket-id">DRAFT-{index + 1}</span>
            <strong>{ticket.title}</strong>
            <span className="ticket-tags"><em>{ticket.tag}</em></span>
          </div>
        ))}
        <div className="scene-note scene-in" style={at(800)}><LockKeyhole aria-hidden="true" />Nothing is created in Jira or Linear yet.</div>
      </div>
    </>
  );
}

const destinations = {
  linear: { name: "Linear", logo: "/integrations/linear.png", prefix: "VER" },
  jira: { name: "Jira", logo: "/integrations/jira.png", prefix: "VL" },
} as const;
type Destination = keyof typeof destinations;
type PublishStatus = "ready" | "publishing" | "published";

/** A small working demo: choose a destination, publish, see the (illustrative) tickets it would create. */
function PublishScene({ active }: { active: boolean }) {
  const checks = ["Engineering reviewed scope and prerequisites", "Decision owner confirmed priority", "Drafts match the approved PRD"];
  const [destination, setDestination] = useState<Destination>("linear");
  const [status, setStatus] = useState<PublishStatus>("ready");
  const timer = useRef<number | undefined>(undefined);
  const target = destinations[destination];

  // Leaving the step resets the demo so it replays from the review state next time.
  useEffect(() => {
    if (active) return;
    window.clearTimeout(timer.current);
    setStatus("ready");
  }, [active]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function choose(next: Destination) {
    window.clearTimeout(timer.current);
    setDestination(next);
    setStatus("ready");
  }

  function publish() {
    if (status !== "ready") return;
    setStatus("publishing");
    timer.current = window.setTimeout(() => setStatus("published"), 700);
  }

  return (
    <>
      <div className="scene-bar"><Send aria-hidden="true" /><span>Publish to delivery tools</span><span className="scene-status" data-tone={status === "published" ? "done" : undefined}>{status === "published" ? "Published" : "Separate review"}</span></div>
      <div className="scene-body">
        <span className="scene-subhead scene-in" style={at(60)} id="publish-destination">Destination</span>
        <div className="scene-destinations scene-in" style={at(140)} role="group" aria-labelledby="publish-destination">
          {(Object.keys(destinations) as Destination[]).map((key) => (
            <button type="button" key={key} aria-pressed={destination === key} data-selected={destination === key} onClick={() => choose(key)} disabled={status === "publishing"}>
              <img src={destinations[key].logo} alt="" width="20" height="20" />{destinations[key].name}
            </button>
          ))}
        </div>
        {status === "published" ? (
          <div className="publish-result" role="status">
            <span className="scene-subhead">Created in {target.name}</span>
            {tickets.map((ticket, index) => (
              <div className="publish-created" style={at(index * 90)} key={ticket.title}>
                <span className="ticket-id">{target.prefix}-{142 + index}</span>
                <strong>{ticket.title}</strong>
                <ArrowUpRight aria-hidden="true" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <span className="scene-subhead scene-in" style={at(260)}>Publishing review</span>
            {checks.map((item, index) => (
              <div className="scene-check scene-in" style={at(340 + index * 220)} key={item}>
                <span className="check-mark" style={at(520 + index * 220)}><Check aria-hidden="true" /></span>{item}
              </div>
            ))}
          </>
        )}
        <div className="scene-publish scene-in" style={at(1100)}>
          {status === "published" ? (
            <button type="button" className="publish-reset" onClick={() => setStatus("ready")}><RotateCcw aria-hidden="true" />Reset demo</button>
          ) : (
            <span>3 ticket drafts ready</span>
          )}
          <button type="button" className="publish-button" data-state={status} onClick={publish} disabled={status !== "ready"}>
            {status === "publishing" ? <LoaderCircle className="publish-spinner" aria-hidden="true" /> : status === "published" ? <Check aria-hidden="true" /> : <Send aria-hidden="true" />}
            {status === "publishing" ? "Publishing…" : status === "published" ? `Published to ${target.name}` : "Publish 3 drafts"}
          </button>
        </div>
      </div>
    </>
  );
}


/**
 * Delivery gates as an interactive list: hovering, focusing or tapping a step highlights it
 * and swaps in an illustrative scene that plays that step. The publish scene is a small
 * working demo (choose Linear or Jira, then publish); nothing leaves the page.
 */
export function DeliverySteps() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: steps.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + steps.length) % steps.length;
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="shell delivery-layout">
      <div className="delivery-copy">
        <ol className="delivery-gates" aria-label="Approval steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <button
                ref={(node) => { buttons.current[index] = node; }}
                type="button"
                className="gate"
                aria-pressed={active === index}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(event) => move(event, index)}
              >
                <span className="gate-number">0{index + 1}</span>
                <span className="gate-text"><strong>{step.title}</strong><span>{step.copy}</span></span>
              </button>
            </li>
          ))}
        </ol>
        <span className="quiet-label">Agent-ready outputs. Human-owned decisions.</span>
      </div>
      <div className="delivery-stage product-frame">
        {/* Only the visible scene is exposed; the others are hidden and unfocusable. */}
        <div className="delivery-scenes" role="region" aria-label="Illustrative delivery workflow">
          {[<DraftScene key="draft" />, <TicketScene key="tickets" />, <PublishScene key="publish" active={active === 2} />].map((scene, index) => (
            <div className="delivery-scene" data-active={active === index} aria-hidden={active !== index} inert={active !== index} key={index}>{scene}</div>
          ))}
        </div>
        <small>Illustrative workflow · Demo data</small>
      </div>
    </div>
  );
}
