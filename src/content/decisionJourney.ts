export type DecisionAudience = "founder" | "product-team";
export type DecisionStage = "signal" | "verify" | "decide" | "approve" | "deliver";

export type DecisionJourneyStep = {
  stage: DecisionStage;
  step: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  narrative: string;
  summary: string;
  status: string;
  metrics: ReadonlyArray<{ label: string; value: string; tone?: "coral" | "blue" | "green" }>;
  items: ReadonlyArray<{ label: string; meta: string; tone?: "coral" | "blue" | "green" }>;
  note: string;
  action: string;
};

export type DecisionJourney = {
  audience: string;
  name: string;
  promise: string;
  description: string;
  steps: ReadonlyArray<DecisionJourneyStep>;
};

export const decisionJourneys: Record<DecisionAudience, DecisionJourney> = {
  founder: {
    audience: "For founders",
    name: "Opportunity Discovery",
    promise: "Find the opportunity worth validating before you commit the team.",
    description: "Start with an observation. End with an approved validation plan grounded in market evidence.",
    steps: [
      {
        stage: "signal",
        step: "01",
        navLabel: "Capture signal",
        eyebrow: "A bounded starting point",
        title: "Turn a repeated founder observation into a signal worth investigating.",
        narrative: "VerityLoop collects the original note alongside matching customer conversations, review themes, and market activity. It keeps the observation narrow enough to test instead of prematurely turning it into a product thesis.",
        summary: "A repeated workflow problem appears across founder notes, review sites, and support communities.",
        status: "Signal bounded",
        metrics: [
          { label: "Source types", value: "4", tone: "blue" },
          { label: "Fresh signals", value: "11", tone: "coral" },
          { label: "Unknowns", value: "3" },
        ],
        items: [
          { label: "Founder note", meta: "Manual escalation is rising", tone: "coral" },
          { label: "G2 reviews", meta: "Handoff context gets lost", tone: "blue" },
          { label: "Community threads", meta: "Teams rebuild the same triage flow" },
        ],
        note: "The problem is specific enough to investigate, but demand is not proven.",
        action: "Verify the pattern",
      },
      {
        stage: "verify",
        step: "02",
        navLabel: "Verify evidence",
        eyebrow: "source-grounded retrieval",
        title: "Separate a recurring pain from a convincing anecdote.",
        narrative: "Supporting evidence, counter-signals, and unresolved questions stay visible in the same workspace. Every claim remains linked to a permissioned source, so the team can inspect where confidence comes from and where it stops.",
        summary: "The pain is repeated across sources, but urgency and willingness to pay remain uncertain.",
        status: "13 sources checked",
        metrics: [
          { label: "Supports", value: "8", tone: "green" },
          { label: "Context", value: "4", tone: "blue" },
          { label: "Conflicts", value: "1", tone: "coral" },
        ],
        items: [
          { label: "Repeated manual routing", meta: "Supported by 5 sources", tone: "green" },
          { label: "Willingness to pay", meta: "No direct evidence", tone: "coral" },
          { label: "Existing alternatives", meta: "Solve reporting, not ownership", tone: "blue" },
        ],
        note: "Evidence supports the workflow pain—not a full product category yet.",
        action: "Form a decision",
      },
      {
        stage: "decide",
        step: "03",
        navLabel: "Frame decision",
        eyebrow: "Evidence-to-decision brief",
        title: "Choose the smallest decision that the evidence can support.",
        narrative: "The system compares strategic relevance, evidence gaps, and the cost of being wrong. It recommends validating assisted triage with a small design-partner group instead of treating weak demand evidence as permission to build a broad platform.",
        summary: "Validate ownership and context transfer before committing to autonomous support workflows.",
        status: "Recommendation ready",
        metrics: [
          { label: "Relevance", value: "High", tone: "green" },
          { label: "Demand", value: "Open", tone: "coral" },
          { label: "Build scope", value: "Narrow", tone: "blue" },
        ],
        items: [
          { label: "Recommended", meta: "Validate with 6 design partners", tone: "coral" },
          { label: "Watch", meta: "AI-native support suites" },
          { label: "Avoid", meta: "Full autonomous routing claim" },
        ],
        note: "The decision preserves speed without converting weak evidence into roadmap certainty.",
        action: "Request approval",
      },
      {
        stage: "approve",
        step: "04",
        navLabel: "Human approval",
        eyebrow: "human-in-the-loop control",
        title: "Make the owner, rationale, and evidence boundary explicit.",
        narrative: "A founder reviews the proposed direction, accepts or revises the evidence boundary, and records why the team is moving. Approval creates decision memory; it does not silently publish work or hand control to an agent.",
        summary: "Approve a six-team validation around assisted triage and preserve the open risks.",
        status: "Approval required",
        metrics: [
          { label: "Decision", value: "Validate", tone: "coral" },
          { label: "Owner", value: "Founder", tone: "blue" },
          { label: "Review", value: "Today" },
        ],
        items: [
          { label: "Scope", meta: "Assisted triage only", tone: "green" },
          { label: "Success gate", meta: "4 of 6 teams confirm urgency" },
          { label: "Recorded rationale", meta: "Evidence and open risks attached", tone: "blue" },
        ],
        note: "Nothing moves into delivery until a human accepts the evidence and trade-offs.",
        action: "Approve direction",
      },
      {
        stage: "deliver",
        step: "05",
        navLabel: "Create plan",
        eyebrow: "Agent-ready output",
        title: "Carry the approved decision into work without losing its context.",
        narrative: "VerityLoop drafts a concise validation brief with interview tasks, success gates, assumptions, and source links. The output stays reviewable and unpublished until the team accepts the delivery details.",
        summary: "A design-partner validation plan is ready for team review.",
        status: "Drafted—not published",
        metrics: [
          { label: "Interviews", value: "6", tone: "blue" },
          { label: "Assumptions", value: "3", tone: "coral" },
          { label: "Source links", value: "13", tone: "green" },
        ],
        items: [
          { label: "Interview guide", meta: "Ownership, urgency, workarounds", tone: "green" },
          { label: "Evidence appendix", meta: "13 permissioned sources", tone: "blue" },
          { label: "Decision gate", meta: "Commit, watch, or stop" },
        ],
        note: "Delivery carries the decision context forward instead of reducing it to another prompt.",
        action: "Review validation brief",
      },
    ],
  },
  "product-team": {
    audience: "For product teams",
    name: "Roadmap Impact",
    promise: "Connect market change to roadmap impact without chasing every competitor move.",
    description: "Detect what changed, match it to product context, and move only after a documented human decision.",
    steps: [
      {
        stage: "signal",
        step: "01",
        navLabel: "Detect change",
        eyebrow: "Verified market change",
        title: "Distinguish a material competitor move from ordinary market noise.",
        narrative: "Pricing changes, release notes, and buyer reviews are grouped into one bounded event. The team sees what actually changed and why it may matter before anyone turns the announcement into an urgent roadmap request.",
        summary: "A competitor introduced team-based packaging and a shared approval workflow.",
        status: "Change detected",
        metrics: [
          { label: "Primary sources", value: "3", tone: "green" },
          { label: "Buyer mentions", value: "7", tone: "blue" },
          { label: "Changed today", value: "Yes", tone: "coral" },
        ],
        items: [
          { label: "Pricing page", meta: "New workspace tier", tone: "coral" },
          { label: "Release notes", meta: "Shared approval queue", tone: "green" },
          { label: "G2 reviews", meta: "Enterprise workflow mentioned" },
        ],
        note: "The system separates a material product change from ordinary competitor noise.",
        action: "Check roadmap context",
      },
      {
        stage: "verify",
        step: "02",
        navLabel: "Match context",
        eyebrow: "Permissioned context match",
        title: "Compare the market change with what the team already knows and owns.",
        narrative: "VerityLoop matches the change against roadmap work, customer calls, and strategy documents. Existing commitments and conflicting evidence remain visible, revealing where the new signal overlaps the roadmap and where relevance is still unproven.",
        summary: "Current permissions work covers part of the workflow; demand for a shared queue is uneven.",
        status: "Context matched",
        metrics: [
          { label: "Roadmap overlap", value: "52%", tone: "blue" },
          { label: "Dependencies", value: "2", tone: "coral" },
          { label: "Customer calls", value: "5", tone: "green" },
        ],
        items: [
          { label: "Linear project", meta: "Workspace permissions in progress", tone: "blue" },
          { label: "Customer calls", meta: "Approval queue requested twice", tone: "green" },
          { label: "Strategy memo", meta: "Enterprise admin is a priority" },
        ],
        note: "The change is adjacent to committed work, but customer relevance is not universal.",
        action: "Compare options",
      },
      {
        stage: "decide",
        step: "03",
        navLabel: "Assess impact",
        eyebrow: "Roadmap decision brief",
        title: "Protect the roadmap while keeping a relevant market signal visible.",
        narrative: "The recommendation is to keep the existing permissions milestone, validate demand for a shared approval queue, and avoid copying the competitor’s packaging. Each option is tied to evidence, uncertainty, and a clear consequence.",
        summary: "Watch the market change now; validate enterprise relevance before expanding scope.",
        status: "Impact assessed",
        metrics: [
          { label: "Strategic fit", value: "High", tone: "green" },
          { label: "Urgency", value: "Medium", tone: "coral" },
          { label: "Roadmap move", value: "No", tone: "blue" },
        ],
        items: [
          { label: "Keep", meta: "Workspace permissions milestone", tone: "green" },
          { label: "Validate", meta: "Shared approval queue demand", tone: "coral" },
          { label: "Do not copy", meta: "Competitor packaging structure" },
        ],
        note: "The recommendation protects the roadmap while keeping the market signal visible.",
        action: "Send for approval",
      },
      {
        stage: "approve",
        step: "04",
        navLabel: "Approve response",
        eyebrow: "human-in-the-loop control",
        title: "Record why the roadmap is not moving—and what could change that.",
        narrative: "The product lead confirms the response, assigns an owner and review date, and records the evidence threshold that would reopen the decision. The result is durable decision memory instead of an unexplained backlog change.",
        summary: "Approve targeted research with no immediate roadmap expansion.",
        status: "Approved by product lead",
        metrics: [
          { label: "Decision", value: "Watch", tone: "blue" },
          { label: "Review in", value: "30d", tone: "coral" },
          { label: "Owner", value: "PM", tone: "green" },
        ],
        items: [
          { label: "Roadmap", meta: "No scope expansion", tone: "green" },
          { label: "Research", meta: "5 enterprise interviews", tone: "coral" },
          { label: "Decision memory", meta: "Rationale and sources saved", tone: "blue" },
        ],
        note: "Approval means the team can explain why it did not react—not just what it decided.",
        action: "Approve response",
      },
      {
        stage: "deliver",
        step: "05",
        navLabel: "Draft delivery",
        eyebrow: "Agent-ready output",
        title: "Translate the approved response into reviewable delivery work.",
        narrative: "VerityLoop drafts the research project, interview tasks, acceptance gates, dependencies, and source-linked context. Agents can continue from a governed decision without publishing work or inventing missing product context.",
        summary: "An enterprise workflow research project is drafted for team review.",
        status: "Drafted—not published",
        metrics: [
          { label: "Draft tasks", value: "5", tone: "blue" },
          { label: "Dependencies", value: "2", tone: "coral" },
          { label: "Reviewers", value: "3", tone: "green" },
        ],
        items: [
          { label: "Linear project draft", meta: "Enterprise workflow research", tone: "blue" },
          { label: "Interview task", meta: "5 target accounts", tone: "green" },
          { label: "Decision review", meta: "Reopen only if gate clears", tone: "coral" },
        ],
        note: "Drafts remain reviewable and unpublished until the team accepts the delivery details.",
        action: "Review delivery draft",
      },
    ],
  },
};
