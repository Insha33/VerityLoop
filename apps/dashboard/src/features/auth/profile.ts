import { isValidEmail } from "@/lib/email";

export type Profile = { email: string; name: string; domain: string; organization: string | null };
// Demo routing rules only. Production needs managed domains and verified identities.
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com", "aol.com",
  "icloud.com", "me.com", "proton.me", "protonmail.com", "mail.com", "gmx.com",
]);
export function profileForEmail(value: string): Profile {
  const email = value.trim().toLowerCase();
  if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
  const [local, domain] = email.split("@");
  const title = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  return {
    email, domain,
    name: local.split(/[._+-]/).filter(Boolean).map(title).join(" "),
    organization: PERSONAL_DOMAINS.has(domain) ? null : title(domain.split(".")[0]),
  };
}
