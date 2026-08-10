import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("VerityLoop marketing page", () => {
  it("renders the approved hero and technical product language", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Turn market change into your next product decision.",
    );
    expect(container).toHaveTextContent("MCP-ready context");
    expect(container).toHaveTextContent("Agent-ready outputs");
    expect(container).toHaveTextContent("source-grounded retrieval");
    expect(container).toHaveTextContent("decision memory");
    expect(container).toHaveTextContent("human-in-the-loop");
  });

  it("places Product, How it works, and Solutions in semantic DOM order", () => {
    const { container } = render(<HomePage />);
    const product = container.querySelector("#product");
    const workflow = container.querySelector("#how-it-works");
    const solutions = container.querySelector("#solutions");

    expect(product).not.toBeNull();
    expect(workflow).not.toBeNull();
    expect(solutions).not.toBeNull();
    if (!product || !workflow || !solutions) throw new Error("Expected all primary sections");
    expect(product.compareDocumentPosition(workflow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workflow.compareDocumentPosition(solutions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("gives both audiences equal prominence in the solutions section", () => {
    render(<HomePage />);

    const solutions = screen.getByRole("region", { name: "Solutions" });
    expect(solutions).toHaveTextContent("For founders");
    expect(solutions).toHaveTextContent("Opportunity Discovery");
    expect(solutions).toHaveTextContent("For product teams");
    expect(solutions).toHaveTextContent("Roadmap Impact");
  });

  it("renders FAQ and the three approved waitlist conversion points", () => {
    render(<HomePage />);

    expect(screen.getByRole("region", { name: "Frequently asked questions" })).toBeInTheDocument();
    expect(screen.getAllByText("Join the waitlist")).toHaveLength(3);
  });
});
