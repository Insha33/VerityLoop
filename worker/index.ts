import { Resend } from "resend";

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

function normalizeSignup(value: unknown): WaitlistSignup | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    !isAudience(body.audience)
  ) {
    return null;
  }

  return { name, email, audience: body.audience };
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
      source: "marketing-site",
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
    html: `<h2>New waitlist signup</h2><p><strong>Name:</strong> ${escapeHtml(signup.name)}</p><p><strong>Email:</strong> ${escapeHtml(signup.email)}</p><p><strong>Role:</strong> ${audienceLabels[signup.audience]}</p>`,
    text: `New VerityLoop waitlist signup\nName: ${signup.name}\nEmail: ${signup.email}\nRole: ${audienceLabels[signup.audience]}`,
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

export async function handleWaitlistRequest(
  request: Request,
  env: WaitlistEnv,
  providerFetch: typeof fetch = fetch,
  notificationSender: NotificationSender = sendNotification,
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
        message: "You’re already on the waitlist.",
      });
    }

    await notificationSender(signup, String(stored.signup.id), env);

    return jsonResponse(
      {
        ok: true,
        duplicate: false,
        message: "You’re on the list. We’ll be in touch soon.",
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
