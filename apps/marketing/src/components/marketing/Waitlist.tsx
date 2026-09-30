"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { marketingCopy } from "@/content/marketing";
import { validateAudience, validateEmail, validateName } from "@/lib/marketing";

export function Waitlist() {
  const { waitlist } = marketingCopy;
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const audienceRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const audience = String(data.get("audience") ?? "");

    setSuccess(false);
    if (!validateName(name)) {
      setStatus("Enter your name to join the waitlist.");
      nameRef.current?.focus();
      return;
    }
    if (!validateEmail(email)) {
      setStatus("Enter a valid work email to join the waitlist.");
      emailRef.current?.focus();
      return;
    }
    if (!validateAudience(audience)) {
      setStatus("Choose the journey that best describes you.");
      audienceRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setStatus("Saving your early-access request…");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, audience }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We couldn’t save your request. Please try again.");
      }

      setSubmitting(false);
      setSuccess(true);
      setStatus(result.message || "You’re on the list. We’ll be in touch soon.");
    } catch (error) {
      setSubmitting(false);
      setStatus(
        error instanceof Error
          ? error.message
          : "We couldn’t save your request. Please try again.",
      );
    }
  };

  return (
    <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
      <div className="waitlist-glow" aria-hidden="true" />
      <div className="shell waitlist-layout">
        <div data-reveal>
          <p className="eyebrow light">{waitlist.eyebrow}</p>
          <h2 id="waitlist-title">{waitlist.title}</h2>
          <p>{waitlist.description}</p>
        </div>
        <form className="waitlist-form" noValidate data-reveal onSubmit={submitWaitlist}>
          <Label htmlFor="name">Name</Label>
          <Input ref={nameRef} id="name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
          <Label htmlFor="email">Work email</Label>
          <Input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
          <fieldset>
            <legend>Role you’re interested in</legend>
            <label>
              <input ref={audienceRef} type="radio" name="audience" value="founder" required />
              <span>Founder</span>
            </label>
            <label>
              <input type="radio" name="audience" value="product-team" />
              <span>Product team</span>
            </label>
            <label>
              <input type="radio" name="audience" value="both" />
              <span>Exploring both</span>
            </label>
          </fieldset>
          <p className={`form-status ${success ? "is-success" : ""}`} aria-live="polite">
            {status}
          </p>
          <Button
            className={`button submit-button ${success ? "is-complete" : ""}`}
            type="submit"
            disabled={submitting || success}
          >
            {success ? "Waitlist joined" : submitting ? "Joining…" : "Join the waitlist"}
            {!success && <span aria-hidden="true">→</span>}
          </Button>
          <small>We’ll only use your email for VerityLoop early-access updates.</small>
        </form>
      </div>
    </section>
  );
}
