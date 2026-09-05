const LOCAL_PART_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
const DOMAIN_LABEL_PATTERN = /^[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/i;
const TOP_LEVEL_DOMAIN_PATTERN = /^(?:[A-Z]{2,63}|XN--[A-Z0-9-]{2,59})$/i;

export function validateEmailSyntax(value: string) {
  const email = value.trim();
  if (!email || email.length > 254) return false;

  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (localPart.length > 64 || domain.length > 253 || !LOCAL_PART_PATTERN.test(localPart)) {
    return false;
  }

  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL_PATTERN.test(label))) {
    return false;
  }

  return TOP_LEVEL_DOMAIN_PATTERN.test(labels.at(-1) ?? "");
}
