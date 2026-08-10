import { faqs } from "@/content/faq";

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VerityLoop",
    description: "VerityLoop builds evidence infrastructure for AI-native product decisions.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VerityLoop",
    description: "AI product decision intelligence for founders and product teams.",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VerityLoop",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Product Management Software",
    operatingSystem: "Web",
    description:
      "An AI product decision platform that connects source-grounded market evidence to opportunity discovery, roadmap impact, agent-ready PRDs, and reviewed ticket drafts.",
    featureList: [
      "Evidence agents for source-grounded retrieval",
      "Opportunity discovery",
      "Roadmap impact analysis",
      "MCP-ready product context",
      "Agent-ready PRD drafts",
      "Human-in-the-loop approval",
      "Decision memory",
      "Reviewed Jira and Linear ticket drafts",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];
