"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronRight, Home, Layers, LogOut, Menu, Settings, X } from "lucide-react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { DropdownMenu, DropdownMenuItem } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Brand } from "@/components/brand";
import { useDemo } from "@/lib/preview-store";

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready, signOut } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { if (ready && !state.profile) router.replace("/sign-up"); }, [ready, state.profile, router]);
  useEffect(() => {
    setMobileOpen(false);
    document.getElementById("page-heading")?.focus();
  }, [pathname]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") setMobileOpen(false); }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  if (!ready || !state.profile) return <div className="loading"><Spinner size="lg" label="Loading your workspace…" /></div>;
  const profile = state.profile;
  const workspaceId = pathname.split("/")[2];
  const workspace = state.workspaces.find((item) => item.id === workspaceId);
  const section = pathname.split("/")[3];
  const crumbs = pathname === "/" ? ["Home"] : pathname === "/settings" ? ["Settings"] : ["Workspaces", ...(workspaceId === "new" ? ["Create workspace"] : workspace ? [workspace.name, ...(section ? [section === "invite" ? "Invite" : section === "connections" ? "Connections" : "Documents"] : [])] : [])];
  const links = [{ href: "/", label: "Home", icon: Home }, { href: "/workspaces", label: "Workspaces", icon: Layers }, { href: "/settings", label: "Settings", icon: Settings }];
  function leave() { signOut(); router.push("/sign-up"); }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {mobileOpen && <button type="button" className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside id="app-navigation" className={`app-sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Account navigation">
      <div className="sidebar-brand"><Link href="/" aria-label="VerityLoop dashboard"><Brand height={35} /></Link><span className="mobile-only"><IconButton variant="ghost" label="Close navigation" icon={<Icon icon={X} />} onClick={() => setMobileOpen(false)} /></span></div>
      <nav>{links.map(({ href, label, icon: NavIcon }) => {
        const active = href === "/" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`nav-item${active ? " active" : ""}`}><NavIcon size={21} aria-hidden="true" />{label}</Link>;
      })}</nav>
      <div className="sidebar-account"><Avatar name={profile.name} size="md" tooltip={false} /><div className="sidebar-account-text"><strong>{profile.name}</strong><span title={profile.email}>{profile.email}</span></div><IconButton variant="ghost" size="sm" label="Sign out" icon={<Icon icon={LogOut} />} onClick={leave} /></div>
    </aside>
    <div className="app-body"><header className="app-header"><span className="mobile-only"><IconButton variant="ghost" label="Open navigation" aria-expanded={mobileOpen} aria-controls="app-navigation" icon={<Icon icon={Menu} />} onClick={() => setMobileOpen(!mobileOpen)} /></span>
      <nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs.map((crumb, index) => <span key={`${crumb}-${index}`}>{index > 0 && <ChevronRight size={13} aria-hidden="true" />}{index === 0 && crumbs.length > 1 ? <Link href="/workspaces">{crumb}</Link> : <span aria-current={index === crumbs.length - 1 ? "page" : undefined}>{crumb}</span>}</span>)}</nav>
      {/* Phones show only the avatar, as the original header did; one of the two menus is always hidden. */}
      <div className="header-account">{[false, true].map((compact) => <span key={String(compact)} className={compact ? "mobile-only" : "desktop-only"}>
        <DropdownMenu alignment="end" hasChevron={!compact} button={{ label: compact ? `Account menu for ${profile.email}` : profile.email, isIconOnly: compact, variant: "ghost", icon: <Avatar name={profile.name} size="sm" tooltip={false} /> }}>
          <DropdownMenuItem icon={Settings} label="Account settings" href="/settings" />
          <DropdownMenuItem icon={LogOut} label="Sign out" onClick={leave} />
        </DropdownMenu>
      </span>)}</div>
    </header>
    <div className="demo-notice"><span className="demo-dot" />Interactive preview<span className="notice-description">Sample workspaces. Invites, connections, and uploads are simulated.</span></div>
    <main id="main-content" className="app-main">{children}</main></div>
  </div>;
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><h1 id="page-heading" tabIndex={-1}>{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{action}</div>;
}
