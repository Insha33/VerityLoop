import {
  decisionContent,
  journeyContent,
  type Audience,
  type DecisionKey,
  type JourneyKey,
} from "@/content/marketing";
import { validateEmailSyntax } from "@/lib/email";

export function getJourneyContent(journey: JourneyKey) {
  return journeyContent[journey];
}

export function getDecisionContent(decision: DecisionKey) {
  return decisionContent[decision];
}

export function validateEmail(value: string) {
  return validateEmailSyntax(value);
}

export function validateAudience(value: string): value is Audience {
  return ["founder", "product-team", "both"].includes(value);
}

export function validateName(value: string) {
  return value.trim().length >= 2;
}

export type SectionPosition = {
  id: string;
  top: number;
  bottom: number;
};

export function getVisibleSection(sections: SectionPosition[], marker = 120) {
  const containing = sections.find((section) => section.top <= marker && section.bottom > marker);
  if (containing) return containing.id;

  return [...sections].sort(
    (sectionA, sectionB) => Math.abs(sectionA.top - marker) - Math.abs(sectionB.top - marker),
  )[0]?.id ?? "";
}
