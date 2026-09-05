import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleDot,
  FileText,
  Link2,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type {
  DecisionAudience,
  DecisionJourneyStep,
} from "@/content/decisionJourney";
import { Brand } from "./Brand";
import styles from "./DecisionJourney.module.css";

type Props = { step: DecisionJourneyStep; audience: DecisionAudience };

const sources = {
  founder: [
    ["Freshdesk", "/integrations/freshdesk.png"],
    ["G2", "/integrations/g2.png"],
    ["Granola", "/integrations/granola.png"],
  ],
  "product-team": [
    ["Notion", "/integrations/notion.png"],
    ["Linear", "/integrations/linear.png"],
    ["Google Drive", "/integrations/google-drive.svg"],
  ],
} as const;

function Source({ audience, index }: { audience: DecisionAudience; index: number }) {
  const [label, src] = sources[audience][index];
  return (
    <span className={styles.source}>
      {/* Static-exported local assets do not need Next's image optimization pipeline. */}
      <img src={src} alt="" width={24} height={24} />
      <span>{label}</span>
    </span>
  );
}

function Action({ children }: { children: string }) {
  return <span className={styles.mockAction}>{children}<ArrowUpRight aria-hidden="true" /></span>;
}

function Signal({ step, audience }: Props) {
  return (
    <div className={`${styles.surface} ${styles.signalSurface}`}>
      <aside className={styles.productNav}>
        <span className={styles.navActive}><CircleDot />Signals</span>
        <span><Sparkles />Decisions</span>
        <span><FileText />Briefs</span>
      </aside>
      <div className={styles.inbox}>
        <header><strong>Signal inbox</strong><span>{step.metrics[1].value} new</span></header>
        <div className={styles.search}><Search /><span>Search captured signals</span></div>
        {step.items.map((item, index) => (
          <div className={styles.sourceRow} data-active={index === 0} key={item.label}>
            <Source audience={audience} index={index} />
            <strong>{item.label}</strong><small>{item.meta}</small>
          </div>
        ))}
      </div>
      <div className={styles.detailPane}>
        <span className={styles.status}><CircleDot />{step.status}</span>
        <h3>{step.summary}</h3>
        <div className={styles.quote}><MessageSquareText /><strong>{step.items[0].meta}</strong><small>Observed across {step.metrics[0].value} source types</small></div>
        <footer><p>{step.note}</p><Action>{step.action}</Action></footer>
      </div>
    </div>
  );
}

function Verify({ step, audience }: Props) {
  return (
    <div className={`${styles.surface} ${styles.verifySurface}`}>
      <aside className={styles.evidenceList}>
        <header><strong>Evidence set</strong><span>{step.status}</span></header>
        {step.items.map((item, index) => (
          <div className={styles.evidenceRow} key={item.label}>
            <Source audience={audience} index={index} />
            <span><strong>{item.label}</strong><small>{item.meta}</small></span>
            {item.tone === "coral" ? <AlertTriangle /> : <CheckCircle2 />}
          </div>
        ))}
        <p><ShieldCheck />Permissioned context only</p>
      </aside>
      <div className={styles.synthesis}>
        <header><span><Sparkles />Evidence synthesis</span><span>View sources</span></header>
        <p className={styles.miniEyebrow}>{step.eyebrow}</p>
        <h3>{step.summary}</h3>
        <div className={styles.meters}>
          {step.metrics.map((metric, index) => (
            <div key={metric.label}><span>{metric.label}</span><i data-index={index} /><strong>{metric.value}</strong></div>
          ))}
        </div>
        <div className={styles.boundary}><AlertTriangle /><span><strong>Evidence boundary</strong>{step.note}</span></div>
        <footer><p>Every claim remains linked to its source.</p><Action>{step.action}</Action></footer>
      </div>
    </div>
  );
}

function Decide({ step }: { step: DecisionJourneyStep }) {
  return (
    <div className={`${styles.surface} ${styles.documentSurface}`}>
      <aside className={styles.documentNav}><span>Decision brief</span><strong>Recommendation</strong><span>Evidence</span><span>Trade-offs</span><span>Open questions</span></aside>
      <div className={styles.document}>
        <header><span>DEC-{step.step} · Draft</span><span className={styles.status}><Sparkles />{step.status}</span></header>
        <p className={styles.miniEyebrow}>{step.eyebrow}</p><h3>{step.summary}</h3>
        <div className={styles.recommendation}><Sparkles /><span><strong>Recommended direction</strong>{step.note}</span></div>
        <div className={styles.options}>
          {step.items.map((item, index) => <div data-selected={index === 0} key={item.label}><span>{index === 0 ? <Check /> : <CircleDot />}{item.label}</span><strong>{item.meta}</strong></div>)}
        </div>
        <footer><p>Recommendation stays reviewable.</p><Action>{step.action}</Action></footer>
      </div>
    </div>
  );
}

function Approve({ step, audience }: Props) {
  return (
    <div className={`${styles.surface} ${styles.approvalSurface}`}>
      <div className={styles.approvalSummary}>
        <header><span className={styles.status}><ShieldCheck />Human control point</span><span>{step.status}</span></header>
        <h3>{step.summary}</h3><p>{step.note}</p>
        <div className={styles.checklist}>{step.items.map((item) => <div key={item.label}><CheckCircle2 /><span><strong>{item.label}</strong><small>{item.meta}</small></span></div>)}</div>
      </div>
      <aside className={styles.reviewPanel}>
        <span>Decision owner</span>
        <div className={styles.reviewer}><i>{audience === "founder" ? "AR" : "PM"}</i><span><strong>{audience === "founder" ? "Founder review" : "Product lead review"}</strong><small>Evidence acknowledged</small></span></div>
        <label>Recorded rationale<span>{step.note}</span></label>
        <div className={styles.reviewActions}><span>Needs revision</span><Action>{step.action}</Action></div>
        <small><ShieldCheck />Approval creates an auditable decision record.</small>
      </aside>
    </div>
  );
}

function Deliver({ step, audience }: Props) {
  return (
    <div className={`${styles.surface} ${styles.deliverySurface}`}>
      <aside className={styles.productNav}><strong>{audience === "founder" ? "Validation plan" : "Roadmap workspace"}</strong><span className={styles.navActive}><FileText />Overview</span><span><CheckCircle2 />Tasks</span><span><Link2 />Evidence</span></aside>
      <div className={styles.deliveryDocument}>
        <header><span className={styles.status}><CircleDot />{step.status}</span><span className={styles.shareDraft}>Share draft</span></header>
        <p className={styles.miniEyebrow}>{step.eyebrow}</p><h3>{step.summary}</h3>
        <div className={styles.taskTable}><header><span>Work item</span><span>Owner</span><span>Status</span></header>{step.items.map((item, index) => <div key={item.label}><span><i>{index + 1}</i><strong>{item.label}</strong><small>{item.meta}</small></span><span>{index === 0 ? "You" : "Team"}</span><span>{index === 0 ? "Ready" : "Draft"}</span></div>)}</div>
        <footer><p><ShieldCheck />{step.note}</p><Action>{step.action}</Action></footer>
      </div>
    </div>
  );
}

export function DecisionJourneyCard({ step, audience }: Props) {
  return (
    <article className={styles.productCard} data-stage={step.stage}>
      <header className={styles.cardChrome}><span className={styles.cardBrand}><Brand /></span><span>{step.eyebrow}</span><small>Illustrative workflow</small></header>
      {step.stage === "signal" && <Signal step={step} audience={audience} />}
      {step.stage === "verify" && <Verify step={step} audience={audience} />}
      {step.stage === "decide" && <Decide step={step} />}
      {step.stage === "approve" && <Approve step={step} audience={audience} />}
      {step.stage === "deliver" && <Deliver step={step} audience={audience} />}
    </article>
  );
}
