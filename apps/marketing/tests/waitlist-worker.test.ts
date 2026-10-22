import { describe, expect, it, vi } from "vitest";

import {
  buildWaitlistNotification,
  buildWaitlistWelcome,
  handleWaitlistRequest,
  type WaitlistEnv,
} from "../worker/index";

const env: WaitlistEnv = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test",
  RESEND_API_KEY: "re_test",
  WAITLIST_NOTIFICATION_EMAIL: "inshaaqib2001@gmail.com",
};

function signupRequest(body: Record<string, unknown>) {
  return new Request("https://runverityloop.com/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("waitlist Worker", () => {
  it("builds the Resend message for the configured team inbox", () => {
    expect(
      buildWaitlistNotification(
        { name: "Insha Aqib", email: "insha@example.com", audience: "product-team" },
        "inshaaqib2001@gmail.com",
      ),
    ).toEqual(
      expect.objectContaining({
        from: "Run Verity Loop <team@runverityloop.com>",
        to: ["inshaaqib2001@gmail.com"],
        replyTo: "team@runverityloop.com",
        subject: "New VerityLoop waitlist signup: Insha Aqib",
      }),
    );
  });

  it("builds an early-access welcome email for the person who signed up", () => {
    const welcome = buildWaitlistWelcome({
      name: "Insha Aqib",
      email: "insha@example.com",
      audience: "founder",
    });

    expect(welcome).toEqual(
      expect.objectContaining({
        to: ["insha@example.com"],
        replyTo: "team@runverityloop.com",
        subject: "You’re in: 2 months of VerityLoop on us",
      }),
    );
    expect(welcome.text).toContain("Hi Insha,");
    expect(welcome.text).toContain("2 months free on your first paid plan when we launch");
  });

  it("fails safely before calling providers when notification configuration is missing", async () => {
    const providerFetch = vi.fn();

    const response = await handleWaitlistRequest(
      signupRequest({ name: "Insha Aqib", email: "insha@example.com", audience: "founder" }),
      { ...env, WAITLIST_NOTIFICATION_EMAIL: "" },
      providerFetch,
    );

    expect(response.status).toBe(503);
    expect(providerFetch).not.toHaveBeenCalled();
  });

  it("rejects invalid signup data before calling external providers", async () => {
    const providerFetch = vi.fn();

    const response = await handleWaitlistRequest(
      signupRequest({ name: "A", email: "not-an-email", audience: "investor" }),
      env,
      providerFetch,
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Enter a valid name, work email, and role.",
    });
    expect(providerFetch).not.toHaveBeenCalled();
  });

  it.each([
    "person..pilot@company.com",
    "person@-company.com",
    "person@company-.com",
  ])("rejects malformed email syntax before calling providers: %s", async (email) => {
    const providerFetch = vi.fn();

    const response = await handleWaitlistRequest(
      signupRequest({ name: "Syntax Test", email, audience: "founder" }),
      env,
      providerFetch,
    );

    expect(response.status).toBe(400);
    expect(providerFetch).not.toHaveBeenCalled();
  });

  it("stores a normalized signup before sending the team notification and welcome", async () => {
    const calls: string[] = [];
    const sendNotification = vi.fn(async () => {
      calls.push("resend");
      return "email-1";
    });
    const sendWelcome = vi.fn(async () => {
      calls.push("welcome");
      return "email-2";
    });
    const providerFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push(url);

      if (url.includes("supabase.co/rest/v1/waitlist") && init?.method === "POST") {
        expect(JSON.parse(String(init.body))).toEqual({
          name: "Insha Aqib",
          email: "insha@example.com",
          interested_role: "founder",
          source: "marketing-site",
        });
        return Response.json([{ id: 42 }], { status: 201 });
      }

      throw new Error(`Unexpected provider request: ${url}`);
    });

    const response = await handleWaitlistRequest(
      signupRequest({
        name: "  Insha Aqib  ",
        email: "  INSHA@example.com ",
        audience: "founder",
      }),
      env,
      providerFetch,
      sendNotification,
      sendWelcome,
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      duplicate: false,
      message: "You’re in. Your 2 free months are reserved. Check your inbox.",
    });
    expect(calls).toHaveLength(3);
    expect(calls[0]).toContain("supabase.co/rest/v1/waitlist");
    expect(calls[1]).toBe("resend");
    expect(calls[2]).toBe("welcome");
    expect(sendNotification).toHaveBeenCalledWith(
      { name: "Insha Aqib", email: "insha@example.com", audience: "founder" },
      "42",
      env,
    );
  });

  it("keeps a stored signup successful when the welcome email fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const providerFetch = vi.fn(async () => Response.json([{ id: 7 }], { status: 201 }));

    const response = await handleWaitlistRequest(
      signupRequest({ name: "Insha Aqib", email: "insha@example.com", audience: "founder" }),
      env,
      providerFetch,
      vi.fn(async () => "email-1"),
      vi.fn(async () => {
        throw new Error("Resend unavailable");
      }),
    );

    expect(response.status).toBe(201);
  });

  it("stores a valid campaign tag and drops an unsafe one", async () => {
    const sources: unknown[] = [];
    const providerFetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      sources.push(JSON.parse(String(init?.body)).source);
      return Response.json([], { status: 200 });
    });

    for (const source of ["X", "launch-thread", "<script>", "a".repeat(41)]) {
      await handleWaitlistRequest(
        signupRequest({ name: "Campaign Test", email: "campaign@example.com", audience: "founder", source }),
        env,
        providerFetch,
      );
    }

    expect(sources).toEqual([
      "marketing-site:x",
      "marketing-site:launch-thread",
      "marketing-site",
      "marketing-site",
    ]);
  });

  it("returns an existing signup without sending another notification", async () => {
    const providerFetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "POST") return Response.json([], { status: 200 });
      throw new Error("Duplicate signup should not trigger another provider request");
    });

    const response = await handleWaitlistRequest(
      signupRequest({ name: "Returning User", email: "returning@example.com", audience: "both" }),
      env,
      providerFetch,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      duplicate: true,
      message: "You’re already on the waitlist. Your early-access offer is saved.",
    });
    expect(providerFetch).toHaveBeenCalledTimes(1);
  });

  it("maps each UI audience value to the existing Supabase role values", async () => {
    const expectedRoles = {
      founder: "founder",
      "product-team": "product_team",
      both: "exploring_both",
    } as const;

    for (const [audience, interestedRole] of Object.entries(expectedRoles)) {
      const providerFetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(JSON.parse(String(init?.body))).toEqual(
          expect.objectContaining({ interested_role: interestedRole }),
        );
        return Response.json([], { status: 200 });
      });

      const response = await handleWaitlistRequest(
        signupRequest({ name: "Role Test", email: `${audience}@example.com`, audience }),
        env,
        providerFetch,
      );
      expect(response.status).toBe(200);
    }
  });
});
