import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductStory } from "@/components/marketing/ProductStory";
import { ProductDetails } from "@/components/marketing/ProductDetails";

// Exercise the scroll-to-step boundary with actual scroll events and React updates.
describe("scroll-driven product story", () => {
  it("advances and reverses with scroll position without a click", async () => {
    const { container } = render(<ProductStory />);
    const track = container.querySelector('#product > div') as HTMLElement;
    let top = 90;
    vi.spyOn(track, "getBoundingClientRect").mockImplementation(() => ({ top, bottom: top + 3000, height: 3000, width: 1000, left: 0, right: 1000, x: 0, y: top, toJSON() {} }));
    const segment = window.innerHeight * 0.8;
    for (const step of [1, 2, 3, 2, 0]) {
      top = 90 - segment * step;
      fireEvent.scroll(window);
      await waitFor(() => expect(screen.getAllByRole("tab")[step]).toHaveAttribute("aria-selected", "true"));
      expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    }
  });

  it("keeps every scene readable in the small-screen or reduced-motion flow", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} } as unknown as MediaQueryList);
    render(<ProductStory />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start with an idea" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Give the decision a plan" })).toBeInTheDocument();
    expect(screen.getByText("PRD review and approval required")).toBeInTheDocument();
  });

  it("opens the matching journey from a section-three example", async () => {
    render(<><ProductStory /><ProductDetails /></>);
    fireEvent.click(screen.getByRole("link", { name: "Explore Roadmap Impact" }));
    expect(screen.getByRole("button", { name: "Product teams" })).toHaveAttribute("aria-pressed", "true");
    const example = screen.getByLabelText("Illustrative roadmap impact example");
    expect(within(example).getByText("Already shipped")).toBeInTheDocument();
    expect(within(example).getByText("Planned")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Explore Opportunity Discovery" }));
    expect(screen.getByRole("button", { name: "Founders" })).toHaveAttribute("aria-pressed", "true");
  });
});
