import { faqs } from "@/content/faq";

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VerityLoop",
    url: "https://runverityloop.com/",
    logo: "https://runverityloop.com/verityloop-logo.svg",
    description: "VerityLoop connects verified market evidence and product context to human-owned product decisions.",
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
      "A market-to-product decision system with cited Opportunity Briefs and Roadmap Impact Briefs, followed by optional PRD and ticket drafting through separate human review gates.",
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
