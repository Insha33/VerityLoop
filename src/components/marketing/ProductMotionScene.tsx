import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, CheckCheck, CircleHelp, FileText, GitBranch, Link2, LockKeyhole, MessageSquare, ScanLine, Search, Sparkles } from "lucide-react";
import type { StoryAudience } from "./ProductStory";
import styles from "./ProductStory.module.css";

const delay = (ms: number) => ({ "--delay": `${ms}ms` } as CSSProperties);

// Synthetic product concepts: motion illustrates a workflow, never performs an app action.
export function ProductMotionScene({ audience, step }: { audience: StoryAudience; step: number }) {
  const founder = audience === "founder";
  if (step === 0) return <div className={styles.composition}>
    <div className={`${styles.floatingLabel} ${styles.reveal}`}><span className={styles.liveDot} />{founder ? "Opportunity Discovery" : "Market signals"}</div>
    <div className={`${styles.window} ${styles.composer} ${styles.reveal}`} style={delay(100)}>
      <div className={styles.windowBar}><span className={styles.appMark}>v</span><span>{founder ? "A starting point" : "A change worth checking"}</span><span className={styles.windowMeta}>VerityLoop</span></div>
      <div className={styles.windowBody}>
        <span className={styles.micro}>{founder ? "WHAT ARE YOU EXPLORING?" : "COMPETITOR UPDATE · TODAY"}</span>
        <p className={styles.idea}>{founder ? "Support teams lose ownership when a ticket changes hands." : "A competitor just introduced shared approval workflows."}</p>
        <div className={styles.inputFooter}><span><Link2 />{founder ? "Notes & links are optional" : "Release notes · Primary source"}</span><span className={styles.mockAction}><ArrowUpRight /></span></div>
      </div>
    </div>
    <div className={styles.connection}><span /><ArrowDown /></div>
    <div className={`${styles.sourceStrip} ${styles.reveal}`} style={delay(650)}>
      {(founder ? ["Customer interviews", "Review themes", "Alternatives"] : ["Product changes", "Pricing pages", "Customer context"]).map((name, index) => <span key={name}><span className={styles.sourceSymbol}>{index === 0 ? <MessageSquare /> : index === 1 ? <Search /> : <GitBranch />}</span>{name}</span>)}
    </div>
    <div className={`${styles.resultNote} ${styles.reveal}`} style={delay(1150)}><ScanLine />{founder ? "Confirm the market framing before discovery." : "Original source attached. Ready to investigate."}</div>
  </div>;

  if (step === 1) return <div className={styles.composition}>
    <div className={`${styles.evidenceSources} ${styles.reveal}`}><span><MessageSquare />{founder ? "Interviews" : "Customer calls"}</span><span><FileText />{founder ? "Reviews" : "Product docs"}</span><span><GitBranch />{founder ? "Alternatives" : "Roadmap"}</span></div>
    <div className={styles.connection}><span /><ArrowDown /></div>
    <div className={`${styles.window} ${styles.reveal}`} style={delay(180)}>
      <div className={styles.windowBar}><ScanLine /><span>{founder ? "Evidence, with the gaps in view" : "Market change meets product context"}</span></div>
      <div className={styles.evidenceBody}>
        <div className={`${styles.evidenceRow} ${styles.reveal}`} style={delay(450)}><span className={styles.evidenceIcon}><CheckCheck /></span><div><strong>{founder ? "Handoff pain appears across sources" : "Approval roles already exist"}</strong><p>{founder ? "Customer interviews + review themes" : "Product documentation · Current capability"}</p></div><span className={styles.citation}>01</span></div>
        <div className={`${styles.evidenceRow} ${styles.reveal}`} style={delay(800)}><span className={styles.evidenceIcon}><Link2 /></span><div><strong>{founder ? "Teams have built their own workarounds" : "A related initiative is already planned"}</strong><p>{founder ? "Interview notes · Reported behavior" : "Linear · Shared approval queue · Planned"}</p></div><span className={styles.citation}>02</span></div>
        <div className={`${styles.uncertainty} ${styles.reveal}`} style={delay(1150)}><CircleHelp /><div><strong>{founder ? "Willingness to pay is still unknown" : "Audit history needs engineering review"}</strong><p>{founder ? "Repeated pain does not yet prove demand." : "An inferred prerequisite, not confirmed scope."}</p></div></div>
      </div>
    </div>
    <div className={`${styles.resultNote} ${styles.reveal}`} style={delay(1500)}><Link2 />Sources, counter-signals, and open questions stay linked.</div>
  </div>;

  if (step === 2) return <div className={styles.composition}>
    <div className={`${styles.window} ${styles.brief} ${styles.reveal}`}>
      <div className={styles.windowBar}><FileText /><span>{founder ? "Opportunity Brief" : "Roadmap Impact Brief"}</span><span className={styles.draft}>FOR REVIEW</span></div>
      <div className={styles.windowBody}>
        <span className={styles.micro}>{founder ? "THE OPPORTUNITY" : "THE ROADMAP QUESTION"}</span>
        <h3>{founder ? "Make support handoffs feel seamless." : "Build on the approval work already planned."}</h3>
        <div className={`${styles.recommendation} ${styles.reveal}`} style={delay(400)}><Sparkles /><div><span>RECOMMENDED NEXT STEP</span><strong>{founder ? "Validate urgency with a small pilot" : "Validate demand before accelerating"}</strong><p>{founder ? "Test ownership and context transfer first." : "Reuse existing roles. Review the audit gap."}</p></div></div>
        <div className={`${styles.options} ${styles.reveal}`} style={delay(750)}><span className={styles.chosen}><Check />Validate</span><span>Watch</span><span>Ignore</span></div>
        <div className={`${styles.briefFooter} ${styles.reveal}`} style={delay(1100)}><span className={styles.avatar}>{founder ? "F" : "PM"}</span><span>Decision owner review<strong>Awaiting your decision</strong></span><LockKeyhole /></div>
      </div>
    </div>
    <div className={`${styles.resultNote} ${styles.reveal}`} style={delay(1400)}>A clear recommendation. The final call stays yours.</div>
  </div>;

  return <div className={styles.composition}>
    <div className={`${styles.approved} ${styles.reveal}`}><Check /><span>Example direction approved</span><span className={styles.approvalOwner}>{founder ? "Founder" : "Product lead"}</span></div>
    <div className={styles.connection}><span /><ArrowDown /></div>
    <div className={`${styles.window} ${styles.plan} ${styles.reveal}`} style={delay(250)}>
      <div className={styles.windowBar}><FileText /><span>Product requirements</span><span className={styles.draft}>DRAFT</span></div>
      <div className={styles.windowBody}><h3>{founder ? "Assisted handoffs: pilot scope" : "Shared approvals: validation scope"}</h3>
        <div className={`${styles.planRow} ${styles.reveal}`} style={delay(550)}><span>01</span><div><strong>Problem & intended outcome</strong><p>{founder ? "Preserve ownership when a ticket moves." : "Make shared decisions traceable."}</p></div></div>
        <div className={`${styles.planRow} ${styles.reveal}`} style={delay(850)}><span>02</span><div><strong>Scope, assumptions & source links</strong><p>Grounded in the approved decision.</p></div></div>
        <div className={`${styles.reviewGate} ${styles.reveal}`} style={delay(1150)}><CircleHelp />PRD review and approval required</div>
      </div>
    </div>
    <div className={`${styles.lockedTickets} ${styles.reveal}`} style={delay(1500)}><LockKeyhole /><span>Optional ticket drafts<small>After PRD approval · Separate publishing review</small></span></div>
  </div>;
}
