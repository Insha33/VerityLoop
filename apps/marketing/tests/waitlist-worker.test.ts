import { describe, expect, it, vi } from "vitest";

import {
  buildWaitlistNotification,
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

  it("stores a normalized signup before sending the team notification", async () => {
    const calls: string[] = [];
    const sendNotification = vi.fn(async () => {
      calls.push("resend");
      return "email-1";
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
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      duplicate: false,
      message: "You’re on the list. We’ll be in touch soon.",
    });
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("supabase.co/rest/v1/waitlist");
    expect(calls[1]).toBe("resend");
    expect(sendNotification).toHaveBeenCalledWith(
      { name: "Insha Aqib", email: "insha@example.com", audience: "founder" },
      "42",
      env,
    );
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
      message: "You’re already on the waitlist.",
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
