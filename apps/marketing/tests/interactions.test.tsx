import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { ContextOrbit } from "@/components/marketing/ContextOrbit";
import { FAQ } from "@/components/marketing/FAQ";
import { ProductWalkthrough } from "@/components/marketing/ProductWalkthrough";
import { Waitlist, WaitlistForm } from "@/components/marketing/Waitlist";
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

  it("supports arrow, Home, and End navigation across workflow tabs", async () => {
    const user = userEvent.setup();
    render(<Workflow />);

    const signal = screen.getByRole("tab", { name: /Signal/i });
    signal.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Verify/i })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /Verify/i })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Deliver/i })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(signal).toHaveFocus();
    expect(signal).toHaveAttribute("tabindex", "0");
  });

  it("loops through workflow stages continuously while visible", async () => {
    vi.useFakeTimers();
    const originalObserver = window.IntersectionObserver;
    class VisibleIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as never);
      }
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
      readonly root = null;
      readonly rootMargin = "0px";
      readonly scrollMargin = "0px";
      readonly thresholds = [0.35];
    }
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: VisibleIntersectionObserver,
    });

    try {
      render(<Workflow />);

      for (let step = 0; step < 5; step += 1) {
        await act(async () => vi.advanceTimersByTimeAsync(1800));
      }

      expect(screen.getByRole("tab", { name: /Signal/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    } finally {
      Object.defineProperty(window, "IntersectionObserver", {
        configurable: true,
        value: originalObserver,
      });
      vi.useRealTimers();
    }
  });

  it("renders the permissioned context radar with accessible source descriptions", () => {
    render(<ContextOrbit />);

    expect(screen.getByLabelText("Permissioned product context sources")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(11);
    expect(screen.getByRole("img", { name: "Notion. Ground product docs" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Notes. Preserve founder context" })).toBeInTheDocument();
    expect(screen.getByText("11 permissioned sources")).toBeInTheDocument();
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

  it("keeps the FAQ accordion controlled from its first render", async () => {
    const user = userEvent.setup();
    const consoleWarning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      render(<FAQ />);

      await user.click(
        screen.getByRole("button", { name: "Is VerityLoop an autonomous product manager?" }),
      );

      expect(consoleWarning.mock.calls.flat().join(" ")).not.toContain(
        "uncontrolled to controlled",
      );
    } finally {
      consoleWarning.mockRestore();
    }
  });

  it("starts with every FAQ answer collapsed", () => {
    render(<FAQ />);

    for (const question of screen.getAllByRole("button")) {
      expect(question).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("renders the FAQ heading and every question without waiting for a reveal observer", () => {
    const { container } = render(<FAQ />);
    const heading = screen.getByRole("heading", { name: "Good questions. Clear answers." });
    const items = container.querySelectorAll<HTMLElement>('[data-slot="accordion-item"]');

    expect(getComputedStyle(heading.parentElement as HTMLElement).opacity).toBe("1");
    expect(items).toHaveLength(6);
    for (const item of items) {
      expect(getComputedStyle(item).opacity).toBe("1");
    }
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

  it("keeps FAQ question copy flexible instead of applying toggle sizing", () => {
    render(<FAQ />);
    const trigger = screen.getByRole("button", {
      name: "Is VerityLoop an autonomous product manager?",
    });
    const question = trigger.querySelector<HTMLElement>(".faq-question");

    expect(question).not.toBeNull();
    expect(getComputedStyle(question as HTMLElement).width).not.toBe("30px");
  });

  it("focuses the first invalid waitlist field and reports a useful error", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    const name = screen.getByLabelText("Name");
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-describedby", "waitlist-form-status");
    expect(screen.getByText("Enter your name to join the waitlist.")).toBeInTheDocument();

    await user.type(name, "A");
    expect(name).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByText("Enter your name to join the waitlist.")).not.toBeInTheDocument();
  });

  it("checks email syntax on blur and clears the error once corrected", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    const email = screen.getByLabelText("Work email");

    await user.type(email, "person@company");
    await user.tab();

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "waitlist-form-status");
    expect(
      screen.getByText("Enter a complete email address like name@company.com."),
    ).toBeInTheDocument();

    await user.click(email);
    await user.clear(email);
    await user.type(email, "person@company.com");

    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(
      screen.queryByText("Enter a complete email address like name@company.com."),
    ).not.toBeInTheDocument();
  });

  it("keeps name and email reachable in keyboard order", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText("Work email")).toHaveFocus();
  });

  it("keeps the complete waitlist form embedded in the section", () => {
    const { container } = render(<Waitlist />);
    const heading = screen.getByRole("heading", {
      name: "Make your next product decision with evidence.",
    });

    expect(getComputedStyle(heading.parentElement as HTMLElement).opacity).toBe("1");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(container.querySelector("#waitlist .waitlist-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeVisible();
    expect(screen.getByLabelText("Work email")).toBeVisible();
  });

  it("switches the waitlist audience without replacing the form", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    const radioGroup = screen.getByRole("radiogroup", {
      name: "Role you’re interested in",
    });
    const fieldset = radioGroup.closest("fieldset");
    const selector = radioGroup.querySelector<HTMLElement>(".waitlist-options");
    const founderCopy = screen.getByText("Founder");

    expect(fieldset).not.toBeNull();
    expect(selector).toHaveAttribute("data-active-audience", "founder");
    expect(screen.getByRole("radio", { name: "Founder" })).toBeChecked();
    expect(getComputedStyle(fieldset as HTMLFieldSetElement).gridTemplateColumns).not.toContain(
      "repeat(3",
    );
    expect(getComputedStyle(founderCopy).borderTopWidth).not.toBe("1px");

    await user.click(screen.getByRole("radio", { name: "Product team" }));

    expect(selector).toHaveAttribute("data-active-audience", "product-team");
    expect(screen.getByRole("radio", { name: "Product team" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Founder" })).not.toBeChecked();
  });

  it("supports keyboard selection of the waitlist audience", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    screen.getByRole("radio", { name: "Founder" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Product team" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Product team" })).toBeChecked();
    await user.keyboard("{ArrowRight}");
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Exploring both" })).toBeChecked();
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
    render(<WaitlistForm />);

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

  it("changes the evidence narrative and animated scene together", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    const evidenceStep = screen.getByRole("tab", { name: /02\s*Find the real opportunity/i });
    await user.click(evidenceStep);
    expect(evidenceStep).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Willingness to pay is still unknown");
    expect(panel).toHaveTextContent("Handoff pain appears across sources");
    expect(panel).toHaveAttribute("aria-labelledby", evidenceStep.id);
  });

  it("lets keyboard users inspect decisions without forcing a scroll", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<HomePage />);
    screen.getByRole("tab", { name: /01\s*Start with an idea/i }).focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("tab", { name: /03\s*Choose what to validate/i })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Opportunity Brief");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Awaiting your decision");
    await user.keyboard("{End}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("PRD review and approval required");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /01\s*Start with an idea/i })).toHaveAttribute("aria-selected", "true");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("switches audiences at the current step and preserves approval gates", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await user.click(screen.getByRole("tab", { name: /03\s*Choose what to validate/i }));
    await user.click(screen.getByRole("button", { name: "Product teams" }));
    expect(screen.getByRole("button", { name: "Product teams" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("tab", { name: /03\s*Decide what should change/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Roadmap Impact Brief");
    expect(screen.getByRole("tabpanel")).not.toHaveTextContent("Opportunity Brief");
    await user.click(screen.getByRole("tab", { name: /04\s*Move forward with intent/i }));
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("After PRD approval · Separate publishing review");
    await user.click(screen.getByRole("button", { name: "Replay product animation" }));
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("PRD review and approval required");
  });

  it("highlights Product when the merged walkthrough crosses the header marker", () => {
    render(<HomePage />);
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    const bounds: Record<string, { top: number; bottom: number }> = {
      top: { top: -1400, bottom: -700 },
      product: { top: 80, bottom: 900 },
      context: { top: 900, bottom: 1500 },
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
    expect(within(nav).getByRole("link", { name: "How it works" })).toHaveClass("is-active");
  });
});
