export type JourneyKey = "opportunity" | "roadmap";
export type DecisionKey = "validate" | "watch" | "ignore";
export type Audience = "founder" | "product-team" | "both";
export type SignalIcon = "idea" | "user" | "trend" | "tag" | "workflow" | "radar";

export type JourneyContent = {
  audience: string;
  name: string;
  kicker: string;
  title: string;
  signals: ReadonlyArray<readonly [SignalIcon, string]>;
  briefTitle: string;
  briefCopy: string;
};

export const journeyContent: Record<JourneyKey, JourneyContent> = {
  opportunity: {
    audience: "For founders",
    name: "Opportunity Discovery",
    kicker: "Your starting point",
    title: "A workflow teams still solve by hand",
    signals: [
      ["idea", "Natural-language idea"],
      ["user", "Target-user hypothesis"],
      ["trend", "Observed market pattern"],
    ],
    briefTitle: "Validate the problem before defining a product",
    briefCopy:
      "The market pattern is credible. Demand, urgency, and willingness to pay remain unknown.",
  },
  roadmap: {
    audience: "For product teams",
    name: "Roadmap Impact",
    kicker: "Verified market change",
    title: "A competitor changed how the category buys",
    signals: [
      ["tag", "Packaging and pricing shift"],
      ["workflow", "New customer workflow"],
      ["radar", "Adjacent product enters"],
    ],
    briefTitle: "Watch the change; validate customer relevance",
    briefCopy:
      "The event is real and strategically adjacent. Existing roadmap work covers part of the capability.",
  },
};

export const evidenceContent = {
  primary: "Direct product pages and release notes establish what changed.",
  context: "Customer and market signals show who may care and why.",
  conflict: "Counter-evidence stays visible when sources or signals disagree.",
} as const;

export const decisionContent = {
  validate: {
    title: "Validate before you commit",
    copy: "Resolve demand, urgency, and feasibility gaps with a focused evidence plan.",
  },
  watch: {
    title: "Watch the signal, not the noise",
    copy: "The change is relevant, but the evidence is not yet strong enough to move the roadmap.",
  },
  ignore: {
    title: "Ignore this change for now",
    copy: "The signal does not clear the relevance threshold for this product and strategy.",
  },
} satisfies Record<DecisionKey, { title: string; copy: string }>;

export const marketingCopy = {
  hero: {
    titleBefore: "Turn",
    titleMarket: "market change",
    titleMiddle: "into your next",
    titleDecision: "product decision",
    subtitle: "Find your next opportunity. Know when your roadmap should move.",
    proofs: ["MCP-ready context", "Agent-ready outputs", "Humans decide"],
  },
  product: {
    eyebrow: "Product",
    title: "See the decision system at work.",
    description: "Inspect the evidence. Choose the outcome. Approve what moves forward.",
  },
  workflow: {
    eyebrow: "How it works",
    title: "From signal to reviewed work.",
    description: "Evidence agents verify. Humans decide. Delivery moves.",
    capabilities: ["source-grounded retrieval", "human-in-the-loop", "agent-ready output"],
    steps: [
      {
        title: "Signal",
        icon: "⌁",
        description: "Start with a question or verified market change.",
        result: "A bounded signal",
      },
      {
        title: "Verify",
        icon: "◎",
        description: "Use source-grounded retrieval to check what changed.",
        result: "Cited evidence",
      },
      {
        title: "Decide",
        icon: "✦",
        description: "Compare relevance, conflicts, unknowns, and options.",
        result: "A decision brief",
      },
      {
        title: "Approve",
        icon: "✓",
        description: "A human chooses the direction before work moves.",
        result: "Human-in-the-loop approval",
      },
      {
        title: "Deliver",
        icon: "↗",
        description: "Generate an agent-ready PRD and reviewed ticket drafts.",
        result: "Ready for delivery review",
      },
    ],
  },
  solutions: {
    eyebrow: "Two starting points. One governed loop.",
    title: "Start with the journey that fits.",
    description: "Two journeys. The same evidence-first decision loop.",
    cards: [
      {
        key: "opportunity" as const,
        audience: "For founders",
        title: "Opportunity Discovery",
        description: "Turn a question into a cited opportunity worth validating.",
        steps: [
          "Describe your starting point",
          "Confirm the market boundary",
          "Discover alternatives and entrants",
          "Choose what to validate next",
        ],
        action: "Explore the founder journey",
      },
      {
        key: "roadmap" as const,
        audience: "For product teams",
        title: "Roadmap Impact",
        description: "Connect a market change to strategy, decision memory, and delivery impact.",
        steps: [
          "Detect a material change",
          "Match permissioned context",
          "Surface conflicts and prerequisites",
          "Decide whether the roadmap moves",
        ],
        action: "Explore the product-team journey",
      },
    ],
  },
  context: {
    eyebrow: "Bring the context you have",
    title: "An MCP-ready context layer for product decisions.",
    description: "Connect permission-scoped product sources. Keep the tools where work already lives.",
    sources: [
      "Customer evidence",
      "PRDs",
      "Strategy docs",
      "Roadmap exports",
      "Linear",
      "Jira",
      "Founder notes",
    ],
  },
  waitlist: {
    eyebrow: "Early access",
    title: "Give your agents product truth - not another prompt.",
    description: "AI-native product context, grounded in evidence and governed by humans.",
  },
} as const;
