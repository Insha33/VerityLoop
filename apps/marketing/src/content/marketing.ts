export type Audience = "founder" | "product-team" | "both";

export const marketingCopy = {
  hero: {
    titleBefore: "Turn",
    titleMarket: "market change",
    titleMiddle: "into your next",
    titleDecision: "product decision",
    subtitle: "See what changed, why it matters, and what your team should do next — grounded in evidence, approved by humans.",
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
      { name: "Notion", icon: "/integrations/notion.png", initials: "N", use: "Ground product docs" },
      { name: "Google Drive", icon: "/integrations/google-drive.svg", initials: "GD", use: "Index shared files" },
      { name: "Linear", icon: "/integrations/linear.png", initials: "L", use: "Connect roadmap work" },
      { name: "Freshdesk", icon: "/integrations/freshdesk.png", initials: "F", use: "Cluster support issues" },
      { name: "Granola", icon: "/integrations/granola.png", initials: "GR", use: "Summarize customer calls" },
      { name: "Notes", icon: "", initials: "NT", use: "Preserve founder context" },
      { name: "G2", icon: "/integrations/g2.png", initials: "G2", use: "Compare buyer feedback" },
      { name: "Fireflies", icon: "/integrations/fireflies.png", initials: "FF", use: "Capture meeting signals" },
      { name: "Jira", icon: "/integrations/jira.png", initials: "J", use: "Trace delivery impact" },
      { name: "App Store", icon: "/integrations/app-store.svg", initials: "AS", use: "Track review themes" },
      { name: "Google Play", icon: "/integrations/google-play.png", initials: "GP", use: "Monitor review changes" },
    ],
  },
  waitlist: {
    eyebrow: "Early access",
    title: "Get early access. 2 months free at launch.",
    description: "Join the early-access list for Opportunity Discovery and Roadmap Impact, and help shape what we build.",
    perks: [
      "2 months free on your first paid plan",
      "Priority invites as we open access in batches",
      "A direct line to the founders",
    ],
    terms: "For everyone who joins before public launch. Covers the first 2 months of one workspace’s paid plan. No card required to join.",
  },
  offer: {
    badge: "Early access: 2 months free at launch",
  },
} as const;
