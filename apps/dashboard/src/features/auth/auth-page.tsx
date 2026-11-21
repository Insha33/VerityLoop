"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Layers, Monitor, Plug, UserRound } from "lucide-react";
import { Arrow, Brand, Modal } from "@/components/ui";
import { isValidEmail } from "@/lib/email";
import { useDemo } from "@/lib/preview-store";

export function AuthPage({ signIn = false }: { signIn?: boolean }) {
  const router = useRouter();
  const demo = useDemo();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [information, setInformation] = useState<string | null>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    demo.signIn(email);
    router.push("/");
  }
  return <main className="auth-page">
    <header className="auth-header"><Link href="/" aria-label="VerityLoop home"><Brand /></Link><div className="auth-header-end"><span className="preview-label" title="Interactive UI preview. No account is created and no email is sent.">Product preview</span><span>{signIn ? "New to VerityLoop?" : "Already have an account?"} <Link href={signIn ? "/sign-up" : "/sign-in"}>{signIn ? "Sign up" : "Sign in"}</Link></span></div></header>
    <section className="auth-form-panel"><div className="auth-form-content">
      <h1>{signIn ? "Welcome back to VerityLoop" : "Create your VerityLoop account"}</h1>
      <p className="page-subtitle">{signIn ? "Pick up where you left off." : "Bring your product work into one place."}</p>
      <form onSubmit={submit} className="auth-form" noValidate>
        <div className="field"><label htmlFor="work-email">Work email</label><input id="work-email" autoComplete="email" type="email" placeholder="you@company.com" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} aria-describedby={error ? "email-error email-hint" : "email-hint"} aria-invalid={Boolean(error)} required />
          <p id="email-hint" className="helper">Use your work email to discover your company’s workspaces.</p>
          {error && <p id="email-error" className="error" role="alert">{error}</p>}
        </div>
        <p className="auth-terms">By continuing, you agree to our <button type="button" className="inline-link" onClick={() => setInformation("Terms")}>Terms</button> and <button type="button" className="inline-link" onClick={() => setInformation("Privacy Policy")}>Privacy Policy</button>.</p>
        <button className="button primary auth-submit" disabled={busy || !demo.ready}>{busy ? "Opening your dashboard…" : "Continue with email"}<Arrow /></button>
      </form>
    </div></section>
    <aside className="auth-preview-panel" aria-label="A look inside VerityLoop"><div className="auth-preview-content">
      <p className="eyebrow">A look inside</p>
      <div className="account-preview"><h2><UserRound size={23} aria-hidden="true" /> Your account</h2><ul>
        <li><Monitor size={22} aria-hidden="true" />Open your dashboard</li>
        <li><Layers size={22} aria-hidden="true" />Find or create a workspace</li>
        <li><Plug size={22} aria-hidden="true" />Connect tools and add context</li>
      </ul></div>
      <p className="preview-caption">Start with your account. Set up your workspace<br className="desktop-break" /> when you’re ready.</p>
    </div></aside>
    {information && <Modal title={information} onClose={() => setInformation(null)}><p>This is an interactive product preview, not a live VerityLoop account. No verification email, invitation, or external connection is created.</p><p className="helper">Your entered email and sample workspace state stay in this browser tab. Documents are represented by their filenames and sizes; their contents are not uploaded. Production service terms are not configured in this preview.</p><div className="dialog-actions"><button className="button primary" onClick={() => setInformation(null)}>Got it</button></div></Modal>}
  </main>;
}
