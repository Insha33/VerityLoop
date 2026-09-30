"use client";

import { useEffect, useState } from "react";

import { getVisibleSection } from "@/lib/marketing";
import { Brand } from "./Brand";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const closeMenus = () => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  };

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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className={`site-header ${activeSection && activeSection !== "top" ? "is-scrolled" : ""}`} data-header>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="VerityLoop home">
          <Brand />
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="nav-menu"
          onClick={() => setMobileOpen((current) => !current)}
        >
          <span className="sr-only">Open navigation</span>
          <span />
          <span />
        </button>
        <div className={`nav-menu ${mobileOpen ? "is-open" : ""}`} id="nav-menu">
          <a
            className={activeSection === "product" ? "is-active" : undefined}
            href="#product"
            onClick={closeMenus}
          >
            Product
          </a>
          <a
            className={activeSection === "how-it-works" ? "is-active" : undefined}
            href="#how-it-works"
            onClick={closeMenus}
          >
            How it works
          </a>
          <div className={`nav-dropdown ${solutionsOpen ? "is-open" : ""}`}>
            <button
              type="button"
              aria-expanded={solutionsOpen}
              className={activeSection === "solutions" ? "is-active" : undefined}
              onClick={() => setSolutionsOpen((current) => !current)}
            >
              Solutions
              <svg className="nav-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>
            <div className="solutions-menu">
              <a href="#opportunity" onClick={closeMenus}>
                <span>For founders</span>
                <strong>Opportunity Discovery</strong>
              </a>
              <a href="#roadmap" onClick={closeMenus}>
                <span>For product teams</span>
                <strong>Roadmap Impact</strong>
              </a>
            </div>
          </div>
          <a
            className={activeSection === "faq" ? "is-active" : undefined}
            href="#faq"
            onClick={closeMenus}
          >
            FAQ
          </a>
        </div>
        <a className="button button-small nav-cta" href="#waitlist">
          Join the waitlist
        </a>
      </nav>
    </header>
  );
}
