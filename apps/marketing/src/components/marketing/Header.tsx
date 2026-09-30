"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getVisibleSection } from "@/lib/marketing";
import { Brand } from "./Brand";

const links = [
  { href: "#product", label: "How it works", section: "product" },
  { href: "#solutions", label: "Solutions", section: "solutions" },
  { href: "#faq", label: "FAQ", section: "faq" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector<HTMLElement>("[data-header]");
      const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")].map(
        (section) => {
          const bounds = section.getBoundingClientRect();
          return { id: section.id, top: bounds.top, bottom: bounds.bottom };
        },
      );
      const marker = (header?.offsetHeight || 78) + 24;
      setActiveSection(getVisibleSection(sections, marker));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`site-header ${activeSection && activeSection !== "top" ? "is-scrolled" : ""}`}
      data-header
    >
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="VerityLoop home">
          <Brand />
        </a>

        <div className="nav-menu" id="nav-menu">
          {links.map((link) => (
            <a
              className={activeSection === link.section ? "is-active" : undefined}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="nav-toggle"
              aria-label="Open navigation"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent className="nav-sheet" side="right">
            <SheetHeader className="nav-sheet-header">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Explore VerityLoop and join the early-access waitlist.
              </SheetDescription>
            </SheetHeader>
            <div className="nav-sheet-links">
              {links.map((link) => (
                <a href={link.href} key={link.href} onClick={closeMobile}>
                  {link.label}
                </a>
              ))}
            </div>
            <Button asChild className="button nav-sheet-cta">
              <a href="#waitlist" onClick={closeMobile}>
                Join the waitlist
              </a>
            </Button>
          </SheetContent>
        </Sheet>

        <Button asChild className="button button-small nav-cta">
          <a href="#waitlist">Join the waitlist</a>
        </Button>
      </nav>
    </header>
  );
}
