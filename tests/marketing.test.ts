import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Manrope: () => ({ variable: "font-manrope" }),
  Newsreader: () => ({ variable: "font-newsreader" }),
}));

import { metadata } from "@/app/layout";
import robots from "@/app/robots";
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
import { structuredData } from "@/lib/structured-data";

describe("marketing content", () => {
  it("publishes one canonical homepage identity to search and social crawlers", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://runverityloop.com/");
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph).toMatchObject({
      url: "/",
      locale: "en_US",
      siteName: "VerityLoop",
    });
  });

  it("advertises the sitemap to allowed crawlers", () => {
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://runverityloop.com/sitemap.xml",
      host: "https://runverityloop.com",
    });
  });

  it("publishes a stable VerityLoop logo for search engines", () => {
    expect(metadata.icons).toMatchObject({
      icon: [
        {
          url: "/brand/favicon.svg?v=rhythm-v1",
          type: "image/svg+xml",
          sizes: "any",
        },
      ],
      shortcut: "/favicon.ico?v=rhythm-v1",
      apple: [{ url: "/apple-touch-icon.png?v=rhythm-v1", sizes: "180x180", type: "image/png" }],
    });

    const organization = structuredData.find((entry) => entry["@type"] === "Organization");
    expect(organization).toMatchObject({
      url: "https://runverityloop.com/",
      logo: "https://runverityloop.com/verityloop-logo.svg",
    });
  });

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
    expect(validateAudience("founder")).toBe(true);
    expect(validateAudience("product-team")).toBe(true);
    expect(validateAudience("both")).toBe(true);
    expect(validateAudience("investor")).toBe(false);
  });

  it.each([
    "person+pilot@company.co.in",
    " first.last@sub-domain.example.com ",
    "x@example.io",
  ])("accepts a structurally valid email address: %s", (email) => {
    expect(validateEmail(email)).toBe(true);
  });

  it.each([
    "person@",
    "person@@company.com",
    ".person@company.com",
    "person.@company.com",
    "person..pilot@company.com",
    "person@-company.com",
    "person@company-.com",
    "person@company..com",
    "person@company.c",
  ])("rejects a malformed email address: %s", (email) => {
    expect(validateEmail(email)).toBe(false);
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

  it("keeps the approved eleven-source context radar without Natural language", () => {
    expect(marketingCopy.context.sources).toHaveLength(11);
    expect(marketingCopy.context.sources.map((source) => source.name)).not.toContain("Natural language");
  });

  it("uses dedicated App Store and Google Drive connector artwork", () => {
    const sourceIcons = new Map(
      marketingCopy.context.sources.map((source) => [source.name, source.icon]),
    );

    expect(sourceIcons.get("App Store")).toBe("/integrations/app-store.svg");
    expect(sourceIcons.get("Google Drive")).toBe("/integrations/google-drive.svg");
  });

  it("explains PRD review gates and preserves privacy boundaries", () => {
    const ticket = faqs.find((faq) => faq.question.includes("publish Jira"));
    const privacy = faqs.find((faq) => faq.question.includes("sensitive product context"));

    expect(ticket?.answer).toContain("Standard ticket drafts follow PRD approval");
    expect(ticket?.answer).toContain("separate publish approval");
    expect(privacy?.answer).toBe(
      "Context is permission-scoped and tenant-private. Access checks happen before retrieval.",
    );
  });
});
