"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Home, Layers, LogOut, Menu, Settings, X } from "lucide-react";
import { Avatar, Brand, Loading } from "@/components/ui";
import { useDemo } from "./store";

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready, signOut } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => { if (ready && !state.profile) router.replace("/"); }, [ready, state.profile, router]);
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    document.getElementById("page-heading")?.focus();
  }, [pathname]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") { setMobileOpen(false); setAccountOpen(false); } }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  if (!ready || !state.profile) return <Loading />;
  const profile = state.profile;
  const workspaceId = pathname.split("/")[3];
  const workspace = state.workspaces.find((item) => item.id === workspaceId);
  const section = pathname.split("/")[4];
  const crumbs = pathname === "/app" ? ["Home"] : pathname === "/app/settings" ? ["Settings"] : ["Workspaces", ...(workspaceId === "new" ? ["Create workspace"] : workspace ? [workspace.name, ...(section ? [section === "invite" ? "Invite" : section === "connections" ? "Connections" : "Documents"] : [])] : [])];
  const links = [{ href: "/app", label: "Home", icon: Home }, { href: "/app/workspaces", label: "Workspaces", icon: Layers }, { href: "/app/settings", label: "Settings", icon: Settings }];
  function leave() { signOut(); router.push("/"); }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {mobileOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside id="app-navigation" className={`app-sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Account navigation">
      <div className="sidebar-brand"><Link href="/app" aria-label="VerityLoop dashboard"><Brand /></Link><button className="icon-button mobile-only" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <nav>{links.map(({ href, label, icon: Icon }) => {
        const active = href === "/app" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`nav-item${active ? " active" : ""}`}><Icon size={21} aria-hidden="true" />{label}</Link>;
      })}</nav>
      <div className="sidebar-account"><Avatar name={profile.name} /><div><strong>{profile.name}</strong><span title={profile.email}>{profile.email}</span></div><button className="icon-button" onClick={leave} aria-label="Sign out"><LogOut size={17} /></button></div>
    </aside>
    <div className="app-body"><header className="app-header"><button className="icon-button mobile-only" aria-expanded={mobileOpen} aria-controls="app-navigation" aria-label="Open navigation" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21} /></button>
      <nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>{index > 0 && <ChevronRight size={13} aria-hidden="true" />}{index === 0 && crumbs.length > 1 ? <Link href="/app/workspaces">{crumb}</Link> : <span aria-current={index === crumbs.length - 1 ? "page" : undefined}>{crumb}</span>}</span>)}</nav>
      <div className="header-account"><button className="account-trigger" aria-expanded={accountOpen} aria-controls="account-menu" onClick={() => setAccountOpen(!accountOpen)}><Avatar name={profile.name} small /><span>{profile.email}</span><ChevronDown size={14} /></button>{accountOpen && <div className="account-menu" id="account-menu"><Link href="/app/settings">Account settings</Link><button onClick={leave}>Sign out</button></div>}</div>
    </header>
    <div className="demo-notice"><span className="demo-dot" />Interactive preview<span className="notice-description">Sample workspaces. Invites, connections, and uploads are simulated.</span></div>
    <main id="main-content" className="app-main">{children}</main></div>
  </div>;
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><h1 id="page-heading" tabIndex={-1}>{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{action}</div>;
}
