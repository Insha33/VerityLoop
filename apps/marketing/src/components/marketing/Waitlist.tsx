"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, User } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { marketingCopy } from "@/content/marketing";
import { validateAudience, validateEmail, validateName } from "@/lib/marketing";

export function WaitlistForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audience, setAudience] = useState("founder");
  const [emailTouched, setEmailTouched] = useState(false);
  const [fieldError, setFieldError] = useState<"name" | "email" | "audience" | null>(null);

  const clearFormMessage = () => {
    if (!submitting && !success) {
      setStatus("");
      setFieldError(null);
    }
  };

  const verifyEmailSyntax = (value: string) => {
    const email = value.trim();
    if (!email) {
      if (fieldError === "email") {
        setStatus("");
        setFieldError(null);
      }
      return;
    }

    if (!validateEmail(email)) {
      setFieldError("email");
      setStatus("Enter a complete email address like name@company.com.");
      return;
    }

    if (fieldError === "email") {
      setStatus("");
      setFieldError(null);
    }
  };

  const submitWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const audience = String(data.get("audience") ?? "");

    setSuccess(false);
    setFieldError(null);
    if (!validateName(name)) {
      setFieldError("name");
      setStatus("Enter your name to join the waitlist.");
      nameRef.current?.focus();
      return;
    }
    if (!validateEmail(email)) {
      setEmailTouched(true);
      setFieldError("email");
      setStatus("Enter a valid work email to join the waitlist.");
      emailRef.current?.focus();
      return;
    }
    if (!validateAudience(audience)) {
      setFieldError("audience");
      setStatus("Choose the journey that best describes you.");
      formRef.current
        ?.querySelector<HTMLButtonElement>('[data-slot="radio-group-item"]')
        ?.focus();
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
      setFieldError(null);
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
    <form
      ref={formRef}
      className="waitlist-form"
      noValidate
      aria-busy={submitting}
      onSubmit={submitWaitlist}
    >
      <div className="waitlist-field">
        <Label htmlFor="name">Name</Label>
        <div className="waitlist-input-shell">
          <User className="waitlist-input-icon" aria-hidden="true" />
          <Input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={fieldError === "name"}
            aria-describedby={fieldError === "name" ? "waitlist-form-status" : undefined}
            onChange={clearFormMessage}
            required
          />
        </div>
      </div>
      <div className="waitlist-field">
        <Label htmlFor="email">Work email</Label>
        <div className="waitlist-input-shell">
          <Mail className="waitlist-input-icon" aria-hidden="true" />
          <Input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={fieldError === "email"}
            aria-describedby={fieldError === "email" ? "waitlist-form-status" : undefined}
            onChange={(event) => {
              if (emailTouched || fieldError === "email") {
                verifyEmailSyntax(event.currentTarget.value);
              } else {
                clearFormMessage();
              }
            }}
            onBlur={(event) => {
              setEmailTouched(true);
              verifyEmailSyntax(event.currentTarget.value);
            }}
            required
          />
        </div>
      </div>
      <fieldset className="waitlist-audience">
        <legend>Role you’re interested in</legend>
        <RadioGroup
          name="audience"
          value={audience}
          required
          aria-label="Role you’re interested in"
          aria-invalid={fieldError === "audience"}
          aria-describedby={fieldError === "audience" ? "waitlist-form-status" : undefined}
          onValueChange={(value) => {
            setAudience(value);
            clearFormMessage();
          }}
        >
          <div className="waitlist-options" data-active-audience={audience}>
            <span className="waitlist-option-indicator" aria-hidden="true" />
            <Label className="waitlist-option" htmlFor="audience-founder">
              <RadioGroupItem id="audience-founder" value="founder" />
              <span>Founder</span>
            </Label>
            <Label className="waitlist-option" htmlFor="audience-product-team">
              <RadioGroupItem id="audience-product-team" value="product-team" />
              <span>Product team</span>
            </Label>
            <Label className="waitlist-option" htmlFor="audience-both">
              <RadioGroupItem id="audience-both" value="both" />
              <span>Exploring both</span>
            </Label>
          </div>
        </RadioGroup>
      </fieldset>
      {status && (
        <Alert
          id="waitlist-form-status"
          className={`form-status ${success ? "is-success" : ""} ${submitting ? "is-pending" : ""}`}
          variant={success ? "default" : "destructive"}
        >
          {success ? (
            <CheckCircle2 aria-hidden="true" />
          ) : submitting ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : (
            <AlertCircle aria-hidden="true" />
          )}
          <AlertDescription aria-live="polite">{status}</AlertDescription>
        </Alert>
      )}
      <Button
        className={`button submit-button ${success ? "is-complete" : ""}`}
        type="submit"
        disabled={submitting || success}
      >
        {success ? "Waitlist joined" : submitting ? "Joining…" : "Join the waitlist"}
        {success ? (
          <CheckCircle2 aria-hidden="true" />
        ) : submitting ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : (
          <ArrowRight aria-hidden="true" />
        )}
      </Button>
      <small>We’ll only use your email for VerityLoop early-access updates.</small>
    </form>
  );
}

export function Waitlist() {
  const { waitlist } = marketingCopy;

  return (
    <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
      <div className="shell waitlist-layout">
        <div className="waitlist-copy">
          <h2 id="waitlist-title">Make your next product decision with evidence.</h2>
          <p>{waitlist.description}</p>
          <span className="quiet-label">Join the early-access waitlist.</span>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
