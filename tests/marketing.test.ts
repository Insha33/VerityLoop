import { describe, expect, it } from "vitest";

import { faqs } from "@/content/faq";
import { marketingCopy } from "@/content/marketing";
import {
  getDecisionContent,
  getJourneyContent,
  getVisibleSection,
  validateAudience,
  validateEmail,
  validateName,
} from "@/lib/marketing";

describe("marketing content", () => {
  it("keeps founders and product teams as distinct, equally represented journeys", () => {
    const opportunity = getJourneyContent("opportunity");
    const roadmap = getJourneyContent("roadmap");

    expect(opportunity.audience).toBe("For founders");
    expect(roadmap.audience).toBe("For product teams");
    expect(opportunity.signals).toHaveLength(3);
    expect(roadmap.signals).toHaveLength(3);
    expect(opportunity.signals).not.toEqual(roadmap.signals);
  });

  it("returns distinct decision guidance for every supported outcome", () => {
    expect(getDecisionContent("validate").title).toMatch(/Validate/i);
    expect(getDecisionContent("watch").title).toMatch(/Watch/i);
    expect(getDecisionContent("ignore").title).toMatch(/Ignore/i);
    expect(getDecisionContent("validate").copy).not.toBe(getDecisionContent("watch").copy);
  });

  it("validates all waitlist fields at their public boundary", () => {
    expect(validateName("Insha")).toBe(true);
    expect(validateName("A")).toBe(false);
    expect(validateEmail("person+pilot@company.co.in")).toBe(true);
    expect(validateEmail("person@")).toBe(false);
    expect(validateAudience("founder")).toBe(true);
    expect(validateAudience("product-team")).toBe(true);
    expect(validateAudience("both")).toBe(true);
    expect(validateAudience("investor")).toBe(false);
  });

  it("selects the section intersecting the fixed-header marker", () => {
    const sections = [
      { id: "product", top: -900, bottom: -100 },
      { id: "how-it-works", top: -100, bottom: 80 },
      { id: "solutions", top: 80, bottom: 980 },
    ];

    expect(getVisibleSection(sections, 120)).toBe("solutions");
  });

  it("retains the approved AI-native and agent vocabulary", () => {
    const copy = JSON.stringify(marketingCopy);

    expect(copy).toMatch(/MCP-ready/i);
    expect(copy).toMatch(/agent-ready/i);
    expect(copy).toMatch(/evidence agents/i);
    expect(copy).toMatch(/source-grounded retrieval/i);
    expect(copy).toMatch(/decision memory/i);
    expect(copy).toMatch(/human-in-the-loop/i);
  });

  it("keeps the approved FAQ answers", () => {
    const ticket = faqs.find((faq) => faq.question.includes("publish Jira"));
    const privacy = faqs.find((faq) => faq.question.includes("sensitive product context"));

    expect(ticket?.answer).toBe("Yes, with PMs approval");
    expect(privacy?.answer).toBe(
      "Context is permission-scoped and tenant-private. Access checks happen before retrieval.",
    );
  });
});
