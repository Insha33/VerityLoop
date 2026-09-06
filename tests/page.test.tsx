import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("VerityLoop marketing page", () => {
  it("explains the product and makes illustrative imagery explicit", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your next product move. Backed by evidence.");
    expect(screen.getByText("Illustrative product preview")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /VerityLoop signal inbox/ })).toBeInTheDocument();
    expect(screen.getByText("MCP-ready context")).toBeInTheDocument();
  });

  it("provides valid destinations for every on-page navigation link", () => {
    const { container } = render(<HomePage />);
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) expect(container.querySelector(href)).not.toBeNull();
    }
    expect(container.querySelector("#product")).not.toContainElement(container.querySelector("#how-it-works") as HTMLElement);
    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(nav).getByRole("link", { name: "How it works" })).toHaveAttribute("href", "#product");
    expect(within(nav).getByRole("link", { name: "Solutions" })).toHaveAttribute("href", "#solutions");
    expect(within(container.querySelector("#solutions") as HTMLElement).getByRole("heading", { level: 2 })).toHaveTextContent(
      /Know what to validate first\.\s*Or what should change next\./,
    );
  });

  it("presents founder and product-team use cases together", () => {
    const { container } = render(<HomePage />);
    const founders = container.querySelector("#opportunity") as HTMLElement;
    const teams = container.querySelector("#roadmap") as HTMLElement;
    expect(founders.parentElement).toBe(teams.parentElement);
    expect(within(founders).getByText("For founders")).toBeInTheDocument();
    expect(within(teams).getByText("For product teams")).toBeInTheDocument();
    expect(within(founders).getByText("Opportunity Brief")).toBeInTheDocument();
    expect(within(teams).getByText("Roadmap Impact Brief")).toBeInTheDocument();
  });

  it("retains FAQ and three waitlist conversion points without a modal", () => {
    render(<HomePage />);
    expect(screen.getByRole("region", { name: "Frequently asked questions" })).toBeInTheDocument();
    expect(screen.getAllByText("Join the waitlist")).toHaveLength(3);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: "Join the waitlist" })) expect(link).toHaveAttribute("href", "#waitlist");
  });

  it("offers a readable mobile hero asset with an accessible description", () => {
    const { container } = render(<HomePage />);
    const preview = screen.getByRole("region", { name: "From signal to decision" });
    expect(within(preview).getByRole("img")).toHaveAttribute("alt", expect.stringContaining("verified evidence"));
    expect(container.querySelector('picture source[media="(max-width: 600px)"]')).toHaveAttribute("srcset", "/product/workspace-mobile.svg");
    expect(screen.getByRole("link", { name: "Explore the product" })).toHaveAttribute("href", "#product");
  });
});
