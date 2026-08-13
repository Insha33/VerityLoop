import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { ContextOrbit } from "@/components/marketing/ContextOrbit";
import { FAQ } from "@/components/marketing/FAQ";
import { ProductWalkthrough } from "@/components/marketing/ProductWalkthrough";
import { Waitlist } from "@/components/marketing/Waitlist";
import { Workflow } from "@/components/marketing/Workflow";

describe("product walkthrough", () => {
  it("switches between the founder and product-team decision contexts", async () => {
    const user = userEvent.setup();
    render(<ProductWalkthrough />);

    await user.click(screen.getByRole("button", { name: /For product teamsRoadmap Impact/i }));

    expect(screen.getByText("A competitor changed how the category buys")).toBeInTheDocument();
    expect(screen.getByText("Packaging and pricing shift")).toBeInTheDocument();
    expect(screen.getByText("Watch the change; validate customer relevance")).toBeInTheDocument();
  });

  it("updates cited evidence and decision guidance from explicit user choices", async () => {
    const user = userEvent.setup();
    render(<ProductWalkthrough />);

    await user.click(screen.getByRole("button", { name: /Counter-evidence/i }));
    expect(screen.getByText(/Counter-evidence stays visible/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Watch" }));
    expect(screen.getByText("Watch the signal, not the noise")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Watch" })).toHaveAttribute("aria-pressed", "true");
  });

  it("uses the human approval control to unlock PRD and ticket outputs", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProductWalkthrough />);

    await user.click(screen.getByRole("button", { name: /Human approval/i }));

    expect(screen.getByRole("button", { name: /Direction approved/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector(".prd-card")).not.toHaveClass("is-locked");
    expect(container.querySelector(".ticket-card")).not.toHaveClass("is-locked");
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
  });
});

describe("supporting interactions", () => {
  it("lets users inspect each visual workflow stage", async () => {
    const user = userEvent.setup();
    render(<Workflow />);

    const deliver = screen.getByRole("tab", { name: /Deliver/i });
    await user.click(deliver);

    expect(deliver).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Generate an agent-ready PRD and reviewed ticket drafts.",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Ready for delivery review");
  });

  it("connects the remaining context sources after Natural language is removed", async () => {
    const user = userEvent.setup();
    render(<ContextOrbit />);

    expect(screen.queryByRole("button", { name: "Natural language" })).not.toBeInTheDocument();

    for (const source of ["Customer evidence", "Roadmap exports", "Linear"]) {
      await user.click(screen.getByRole("button", { name: source }));
      expect(screen.getByText(`${source} connected`)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: source })).toHaveAttribute("aria-pressed", "true");
    }
  });

  it("keeps only one FAQ answer open and lets the active answer close", async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const autonomous = screen.getByRole("button", {
      name: "Is VerityLoop an autonomous product manager?",
    });
    const founders = screen.getByRole("button", {
      name: "Do founders need a product, roadmap, or competitor list to get started?",
    });

    await user.click(founders);
    expect(founders).toHaveAttribute("aria-expanded", "true");
    expect(autonomous).toHaveAttribute("aria-expanded", "false");

    await user.click(founders);
    expect(founders).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps a FAQ question horizontally stable while it opens", async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const founders = screen.getByRole("button", {
      name: "Do founders need a product, roadmap, or competitor list to get started?",
    });
    const closedPadding = getComputedStyle(founders).paddingLeft;

    await user.click(founders);

    expect(getComputedStyle(founders).paddingLeft).toBe(closedPadding);
  });

  it("focuses the first invalid waitlist field and reports a useful error", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);

    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(screen.getByText("Enter your name to join the waitlist.")).toBeInTheDocument();
  });

  it("submits a valid waitlist request to the server and shows confirmation", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        ok: true,
        duplicate: false,
        message: "You’re on the list. We’ll be in touch soon.",
      }),
    );
    render(<Waitlist />);

    await user.type(screen.getByLabelText("Name"), "Insha Aqib");
    await user.type(screen.getByLabelText("Work email"), "insha@example.com");
    await user.click(screen.getByRole("radio", { name: "Founder" }));
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/waitlist",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Insha Aqib",
          email: "insha@example.com",
          audience: "founder",
        }),
      }),
    );
    expect(await screen.findByText("You’re on the list. We’ll be in touch soon.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Waitlist joined" }).querySelector("span")).toBeNull();
  });

  it("sets the product-team journey from the Solutions journey action", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("link", { name: "Explore the product-team journey" }));

    expect(screen.getByRole("button", { name: /For product teamsRoadmap Impact/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("A competitor changed how the category buys")).toBeInTheDocument();
  });

  it("highlights Solutions when the solutions section crosses the header marker", () => {
    render(<HomePage />);
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    const bounds: Record<string, { top: number; bottom: number }> = {
      top: { top: -1400, bottom: -700 },
      product: { top: -700, bottom: -200 },
      "how-it-works": { top: -200, bottom: 80 },
      solutions: { top: 80, bottom: 900 },
      faq: { top: 1500, bottom: 2200 },
      waitlist: { top: 2200, bottom: 3000 },
    };

    sections.forEach((section) => {
      vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
        ...bounds[section.id],
        x: 0,
        y: bounds[section.id]?.top ?? 0,
        left: 0,
        right: 100,
        width: 100,
        height: (bounds[section.id]?.bottom ?? 0) - (bounds[section.id]?.top ?? 0),
        toJSON: () => ({}),
      });
    });

    fireEvent.scroll(window);

    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(nav).getByRole("button", { name: "Solutions" })).toHaveClass("is-active");
  });
});
