import { describe, expect, it } from "vitest";
import { profileForEmail } from "@/features/auth/profile";
import { isValidEmail } from "@/lib/email";

describe("isValidEmail", () => {
  it("checks the format only", () => {
    expect(isValidEmail("alex@acme.com")).toBe(true);
    expect(isValidEmail("  alex@acme.com  ")).toBe(true);
    for (const bad of ["", "alex", "alex@", "@acme.com", "alex@acme", "al ex@acme.com"]) expect(isValidEmail(bad)).toBe(false);
  });
});

describe("profileForEmail", () => {
  it("derives a company organization from a work domain", () => {
    expect(profileForEmail("Alex.Morgan@Acme.io")).toEqual({ email: "alex.morgan@acme.io", domain: "acme.io", name: "Alex Morgan", organization: "Acme" });
  });
  it("gives personal email providers no organization", () => {
    for (const email of ["alex@gmail.com", "alex@outlook.com", "alex@proton.me"]) expect(profileForEmail(email).organization).toBeNull();
  });
  it("splits the local part on dots, underscores, plus and hyphens for the name", () => {
    expect(profileForEmail("jo_ann+news@acme.com").name).toBe("Jo Ann News");
  });
  it("throws on an invalid address", () => {
    expect(() => profileForEmail("not-an-email")).toThrow(/valid email/);
  });
});
