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
    eyebrow: "AI-native product decision intelligence",
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
    description:
      "Switch journeys, inspect evidence, and compare valid outcomes before anything becomes delivery work.",
  },
  workflow: {
    eyebrow: "How it works",
    title: "How VerityLoop moves from evidence to execution.",
    description:
      "Evidence agents turn uncertainty into a governed, human-in-the-loop path from signal to reviewed delivery work.",
    steps: [
      {
        title: "Frame or detect",
        icon: "⌁",
        description: "Begin with a founder’s question or a verified market change.",
      },
      {
        title: "Verify",
        icon: "◎",
        description:
          "Use source-grounded retrieval to check identity, freshness, before-and-after state, and source quality.",
      },
      {
        title: "Decide",
        icon: "✦",
        description: "Review relevance, conflicts, unknowns, and response options.",
      },
      {
        title: "Approve PRD",
        icon: "✓",
        description: "Create an agent-ready PRD only after a human chooses an eligible direction.",
      },
      {
        title: "Review tickets",
        icon: "↗",
        description: "Draft delivery work only after PRD approval and engineering review.",
      },
    ],
  },
  solutions: {
    eyebrow: "Two starting points. One governed loop.",
    title: "Start with the journey that fits.",
    description:
      "VerityLoop adapts its governed agent workflow to the context you have—not the paperwork you do not.",
    cards: [
      {
        key: "opportunity" as const,
        audience: "For founders",
        title: "Opportunity Discovery",
        description:
          "Use evidence agents to turn an idea, problem, or market curiosity into a framed opportunity backed by cited market evidence.",
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
        description:
          "Connect a verified market change to strategy, customers, decision memory, PRDs, roadmap, and delivery work before reacting.",
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
    description:
      "Begin with one sentence or connect permission-scoped strategy, product, customer, and delivery sources. VerityLoop gives evidence agents grounded context without replacing the tools where work already lives.",
    sources: [
      "Natural language",
      "PRDs",
      "Strategy docs",
      "Roadmap exports",
      "Linear",
      "Jira",
      "Founder notes",
      "Customer evidence",
    ],
  },
  waitlist: {
    eyebrow: "Early access",
    title: "Give your agents product truth—not another prompt.",
    description:
      "Join the VerityLoop waitlist for MCP-ready context, agent-ready outputs, and decisions grounded in evidence.",
  },
} as const;
