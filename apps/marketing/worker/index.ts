import { Resend } from "resend";
import { validateEmailSyntax } from "../src/lib/email";

export type WaitlistEnv = {
  ASSETS?: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  WAITLIST_NOTIFICATION_EMAIL: string;
};

type WaitlistAudience = "founder" | "product-team" | "both";

type WaitlistSignup = {
  name: string;
  email: string;
  audience: WaitlistAudience;
  campaign?: string;
};

type StoredSignup = {
  id: number;
};

const jsonHeaders = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isAudience(value: unknown): value is WaitlistAudience {
  return value === "founder" || value === "product-team" || value === "both";
}

// Campaign tags come from public URLs, so anything unexpected is dropped rather than stored.
function normalizeCampaign(value: unknown) {
  if (typeof value !== "string") return undefined;
  const campaign = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(campaign) ? campaign : undefined;
}

function normalizeSignup(value: unknown): WaitlistSignup | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (
    name.length < 2 ||
    name.length > 100 ||
    !validateEmailSyntax(email) ||
    !isAudience(body.audience)
  ) {
    return null;
  }

  const campaign = normalizeCampaign(body.source);
  return { name, email, audience: body.audience, ...(campaign ? { campaign } : {}) };
}

function supabaseHeaders(env: WaitlistEnv, prefer?: string) {
  return {
    apikey: env.SUPABASE_SECRET_KEY,
    authorization: `Bearer ${env.SUPABASE_SECRET_KEY}`,
    "content-type": "application/json",
    ...(prefer ? { prefer } : {}),
  };
}

function supabaseEndpoint(env: WaitlistEnv, query = "") {
  return `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/waitlist${query}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

async function storeSignup(
  signup: WaitlistSignup,
  env: WaitlistEnv,
  providerFetch: typeof fetch,
): Promise<{ signup: StoredSignup; duplicate: boolean }> {
  const interestedRoles: Record<WaitlistAudience, string> = {
    founder: "founder",
    "product-team": "product_team",
    both: "exploring_both",
  };
  const insertResponse = await providerFetch(supabaseEndpoint(env, "?on_conflict=email"), {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=ignore-duplicates,return=representation"),
    body: JSON.stringify({
      name: signup.name,
      email: signup.email,
      interested_role: interestedRoles[signup.audience],
      source: signup.campaign ? `marketing-site:${signup.campaign}` : "marketing-site",
    }),
  });

  if (!insertResponse.ok) throw new Error(`Supabase insert failed: ${insertResponse.status}`);
  const inserted = (await insertResponse.json()) as StoredSignup[];
  if (inserted[0]) return { signup: inserted[0], duplicate: false };
  return { signup: { id: 0 }, duplicate: true };
}

export function buildWaitlistNotification(
  signup: WaitlistSignup,
  recipient: string,
) {
  const audienceLabels: Record<WaitlistAudience, string> = {
    founder: "Founder",
    "product-team": "Product team",
    both: "Exploring both",
  };

  return {
    from: "Run Verity Loop <team@runverityloop.com>",
    to: [recipient],
    subject: `New VerityLoop waitlist signup: ${signup.name}`,
    html: `<h2>New waitlist signup</h2><p><strong>Name:</strong> ${escapeHtml(signup.name)}</p><p><strong>Email:</strong> ${escapeHtml(signup.email)}</p><p><strong>Role:</strong> ${audienceLabels[signup.audience]}</p><p><strong>Source:</strong> ${signup.campaign ?? "direct"}</p>`,
    text: `New VerityLoop waitlist signup\nName: ${signup.name}\nEmail: ${signup.email}\nRole: ${audienceLabels[signup.audience]}\nSource: ${signup.campaign ?? "direct"}`,
    replyTo: "team@runverityloop.com",
  };
}

export function buildWaitlistWelcome(signup: WaitlistSignup) {
  const firstName = signup.name.split(" ")[0];

  return {
    from: "Run Verity Loop <team@runverityloop.com>",
    to: [signup.email],
    subject: "You’re in: 2 months of VerityLoop on us",
    html: `<p>Hi ${escapeHtml(firstName)},</p><p>Thanks for joining the VerityLoop waitlist. You’re now a founding member, which means:</p><ul><li>2 months free on any paid plan when we launch</li><li>Early access before the public launch</li><li>A direct line to the founders</li></ul><p>One question while we build: what product decision are you wrestling with right now? Just hit reply. We read every message, and your answer shapes what we build first.</p><p>The VerityLoop team</p>`,
    text: `Hi ${firstName},\n\nThanks for joining the VerityLoop waitlist. You’re now a founding member, which means:\n\n- 2 months free on any paid plan when we launch\n- Early access before the public launch\n- A direct line to the founders\n\nOne question while we build: what product decision are you wrestling with right now? Just hit reply. We read every message, and your answer shapes what we build first.\n\nThe VerityLoop team`,
    replyTo: "team@runverityloop.com",
  };
}

type NotificationSender = (
  signup: WaitlistSignup,
  signupId: string,
  env: WaitlistEnv,
) => Promise<string>;

const sendNotification: NotificationSender = async (signup, signupId, env) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send(
    buildWaitlistNotification(signup, env.WAITLIST_NOTIFICATION_EMAIL),
    { idempotencyKey: `waitlist/${signupId}` },
  );

  if (result.error || !result.data?.id) {
    throw new Error(`Resend notification failed: ${result.error?.message ?? "unknown error"}`);
  }
  return result.data.id;
};

const sendWelcome: NotificationSender = async (signup, signupId, env) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send(buildWaitlistWelcome(signup), {
    idempotencyKey: `waitlist-welcome/${signupId}`,
  });

  if (result.error || !result.data?.id) {
    throw new Error(`Resend welcome failed: ${result.error?.message ?? "unknown error"}`);
  }
  return result.data.id;
};

export async function handleWaitlistRequest(
  request: Request,
  env: WaitlistEnv,
  providerFetch: typeof fetch = fetch,
  notificationSender: NotificationSender = sendNotification,
  welcomeSender: NotificationSender = sendWelcome,
) {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_SECRET_KEY ||
    !env.RESEND_API_KEY ||
    !env.WAITLIST_NOTIFICATION_EMAIL
  ) {
    console.error("Waitlist Worker is missing required provider configuration.");
    return jsonResponse({ ok: false, message: "Waitlist is temporarily unavailable." }, 503);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Send valid JSON." }, 400);
  }

  const signup = normalizeSignup(payload);
  if (!signup) {
    return jsonResponse(
      { ok: false, message: "Enter a valid name, work email, and role." },
      400,
    );
  }

  try {
    const stored = await storeSignup(signup, env, providerFetch);
    if (stored.duplicate) {
      return jsonResponse({
        ok: true,
        duplicate: true,
        message: "You’re already on the waitlist. Your founding-member offer is saved.",
      });
    }

    await notificationSender(signup, String(stored.signup.id), env);

    // The signup is already stored, so a failed welcome email should not fail the request.
    try {
      await welcomeSender(signup, String(stored.signup.id), env);
    } catch (error) {
      console.error("Waitlist welcome email failed", error);
    }

    return jsonResponse(
      {
        ok: true,
        duplicate: false,
        message: "You’re in. Your 2 free months are reserved. Check your inbox.",
      },
      201,
    );
  } catch (error) {
    console.error("Waitlist submission failed", error);
    return jsonResponse(
      { ok: false, message: "We couldn’t save your request. Please try again." },
      502,
    );
  }
}

export default {
  async fetch(request: Request, env: WaitlistEnv) {
    const url = new URL(request.url);
    if (url.pathname === "/api/waitlist") return handleWaitlistRequest(request, env);
    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ ok: false, message: "Not found." }, 404);
    }
    return env.ASSETS?.fetch(request) ?? new Response("Not found", { status: 404 });
  },
};
