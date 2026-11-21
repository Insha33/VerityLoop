"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, FileText, Globe, Home, Layers, Phone, Settings, Activity } from "lucide-react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Link as TextLink } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import { Brand, BrandMark } from "@/components/brand";
import { SignalGrid } from "@/components/signal-grid";
import { isValidEmail } from "@/lib/email";
import { useDemo } from "@/lib/preview-store";

const logo = (name: "jira" | "linear") => <Image key={name} className="stage-logo" src={`/integrations/${name}.png`} width={16} height={16} alt="" />;
// Sample briefs for the illustration only; nothing here is real customer data.
const SAMPLE_BRIEFS = [
  { title: "Competitor moved to usage-based pricing", sources: [<Icon key="w" icon={Globe} size="sm" />, logo("jira"), <Icon key="b" icon={BookOpen} size="sm" />, <Icon key="p" icon={Phone} size="sm" />], status: <Badge variant="orange" label="Needs review" />, owner: "Maya" },
  { title: "Enterprise SSO requests are rising", sources: [logo("linear"), <Icon key="f" icon={FileText} size="sm" />], status: <Badge label="Drafting" />, owner: "Sam" },
  { title: "Onboarding drop-off after the import step", sources: [logo("jira"), <Icon key="p" icon={Phone} size="sm" />], status: <Badge variant="success" label="Approved" />, owner: "Alex" },
  { title: "API rate-limit complaints in support", sources: [logo("linear"), <Icon key="b" icon={BookOpen} size="sm" />], status: <Badge label="Drafting" />, owner: "Jo" },
  { title: "Offline mode asked for in discovery calls", sources: [<Icon key="p" icon={Phone} size="sm" />, <Icon key="f" icon={FileText} size="sm" />], status: <Badge variant="success" label="Approved" />, owner: "Maya" },
];

function ProductStage() {
  return <div className="auth-stage">
    <SignalGrid />
    <h2 className="auth-stage-heading">Your next product move<span>Backed by evidence.</span></h2>
    {/* A picture of the product: hidden from assistive technology and inert, so nothing in it is focusable. */}
    <div aria-hidden="true" inert>
      <div className="stage-app">
        <div className="stage-rail">
          <span><BrandMark size={20} /></span>
          <span><Icon icon={Home} size="sm" /></span>
          <span className="on"><Icon icon={Layers} size="sm" /></span>
          <span><Icon icon={Settings} size="sm" /></span>
          <hr />
          <span className="accent"><Icon icon={FileText} size="sm" /></span>
          <span><Icon icon={Activity} size="sm" /></span>
        </div>
        <div className="stage-main">
          <div className="stage-crumbs">Core Platform / Decision briefs</div>
          <div className="stage-title">Decision briefs</div>
          <div className="stage-head"><span>Brief</span><span>Sources</span><span>Status</span><span>Owner</span></div>
          {SAMPLE_BRIEFS.map((brief) => <div className="stage-row" key={brief.title}>
            <span>{brief.title}</span><span className="stage-sources">{brief.sources}</span><span>{brief.status}</span><Avatar name={brief.owner} size="sm" tooltip={false} />
          </div>)}
        </div>
      </div>
      <div className="stage-brief">
        <div className="stage-brief-head"><span>Decision brief</span><Badge variant="orange" label="Needs review" /></div>
        <div className="stage-brief-title">Review the Growth tier before Q3 planning</div>
        <div className="stage-brief-label">Cited from</div>
        <div className="stage-chips">
          <span><Icon icon={Globe} size="sm" />Competitor pricing page</span>
          <span>{logo("jira")}CORE-214</span>
          <span><Icon icon={Phone} size="sm" />Discovery call</span>
        </div>
        <div className="stage-brief-actions"><Button variant="primary" size="sm" label="Approve" /><Button size="sm" label="Request changes" /></div>
      </div>
    </div>
  </div>;
}

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
  function open(event: React.MouseEvent, title: string) { event.preventDefault(); setInformation(title); }
  return <main className="auth-page">
    <header className="auth-header"><Link href="/" aria-label="VerityLoop home"><Brand height={37} /></Link><div className="auth-header-end"><span className="preview-label" title="Interactive UI preview. No account is created and no email is sent.">Product preview</span><span>{signIn ? "New to VerityLoop?" : "Already have an account?"} <Link href={signIn ? "/sign-up" : "/sign-in"}>{signIn ? "Sign up" : "Sign in"}</Link></span></div></header>
    <section className="auth-form-panel"><div className="auth-form-content">
      <h1>{signIn ? "Welcome back to VerityLoop" : "Create your VerityLoop account"}</h1>
      <p className="page-subtitle">{signIn ? "Pick up where you left off." : "Bring your product work into one place."}</p>
      <form onSubmit={submit} className="auth-form" noValidate>
        <TextInput type="email" label="Work email" autoComplete="email" placeholder="you@company.com" size="lg" value={email}
          onChange={(value) => { setEmail(value); setError(""); }} status={error ? { type: "error", message: error } : undefined} statusVariant="detached" />
        <p className="helper">Use your work email to discover your company’s workspaces.</p>
        <p className="auth-terms">By continuing, you agree to our <TextLink href="#terms" color="primary" hasUnderline weight="medium" onClick={(event) => open(event, "Terms")}>Terms</TextLink> and <TextLink href="#privacy" color="primary" hasUnderline weight="medium" onClick={(event) => open(event, "Privacy Policy")}>Privacy Policy</TextLink>.</p>
        <div className="auth-submit"><Button type="submit" variant="primary" size="lg" width="100%" isDisabled={!demo.ready} isLoading={busy} label={busy ? "Opening your dashboard…" : "Continue with email"} endContent={<Icon icon={ArrowRight} />} /></div>
      </form>
    </div></section>
    <aside className="auth-preview-panel" aria-label="A look inside VerityLoop"><ProductStage /></aside>
    <Dialog isOpen={information !== null} onOpenChange={(isOpen) => { if (!isOpen) setInformation(null); }}>
      <DialogHeader title={information} onOpenChange={() => setInformation(null)} />
      <VStack gap={4} padding={4}>
        <Text>This is an interactive product preview, not a live VerityLoop account. No verification email, invitation, or external connection is created.</Text>
        <Text type="supporting" color="secondary">Your entered email and sample workspace state stay in this browser tab. Documents are represented by their filenames and sizes; their contents are not uploaded. Production service terms are not configured in this preview.</Text>
        <HStack justify="end"><Button variant="primary" label="Got it" onClick={() => setInformation(null)} /></HStack>
      </VStack>
    </Dialog>
  </main>;
}
