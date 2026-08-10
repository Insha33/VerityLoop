export type FAQItem = {
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    question: "Is VerityLoop an autonomous product manager?",
    answer:
      "No. VerityLoop uses evidence agents to recommend and draft. A human owns priorities, approval, and every external commitment.",
  },
  {
    question: "Do founders need a product, roadmap, or competitor list to get started?",
    answer:
      "No. Opportunity Discovery can begin with one meaningful sentence about a problem, workflow, target user, idea, or market curiosity.",
  },
  {
    question: "Does a competitor launch automatically become roadmap work?",
    answer:
      "No. Competitor activity is one signal. VerityLoop also surfaces strategic fit, customer evidence, prerequisites, conflicts, and unknowns.",
  },
  {
    question: "Can VerityLoop publish Jira or Linear tickets?",
    answer: "Yes, with PMs approval",
  },
  {
    question: "How does VerityLoop handle sensitive product context?",
    answer: "Context is permission-scoped and tenant-private. Access checks happen before retrieval.",
  },
  {
    question: "What do MCP-ready and agent-ready mean in VerityLoop?",
    answer:
      "MCP-ready means product context is structured for permissioned connections to agent tools. Agent-ready means approved PRDs and ticket drafts include the scope, evidence, unknowns, and acceptance criteria an AI agent needs to act with less clarification.",
  },
];
