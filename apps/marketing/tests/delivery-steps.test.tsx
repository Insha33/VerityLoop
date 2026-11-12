import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeliverySteps } from "@/components/marketing/DeliverySteps";

describe("interactive delivery steps", () => {
  const scenes = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>(".delivery-scene")].map((scene) => scene.dataset.active);

  it("starts on the first step with its scene showing", () => {
    const { container } = render(<DeliverySteps />);
    const steps = screen.getAllByRole("button");
    expect(steps.map((step) => step.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    expect(scenes(container)).toEqual(["true", "false", "false"]);
  });

  it("follows the mouse, a tap or keyboard focus to the matching scene", () => {
    const { container } = render(<DeliverySteps />);
    const [first, second, third] = screen.getAllByRole("button");
    fireEvent.pointerEnter(second, { pointerType: "mouse" });
    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(scenes(container)).toEqual(["false", "true", "false"]);
    fireEvent.click(third);
    expect(scenes(container)).toEqual(["false", "false", "true"]);
    fireEvent.focus(first);
    expect(scenes(container)).toEqual(["true", "false", "false"]);
  });

  it("ignores touch pointer-enter so a scroll past the list does not switch scenes", () => {
    const { container } = render(<DeliverySteps />);
    fireEvent.pointerEnter(screen.getAllByRole("button")[2], { pointerType: "touch" });
    expect(scenes(container)).toEqual(["true", "false", "false"]);
  });

  it("moves between steps with arrow keys and wraps around", () => {
    const { container } = render(<DeliverySteps />);
    const [first] = screen.getAllByRole("button");
    fireEvent.keyDown(first, { key: "ArrowUp" });
    expect(scenes(container)).toEqual(["false", "false", "true"]);
  });

  it("keeps the illustrative scenes out of the accessibility tree", () => {
    const { container } = render(<DeliverySteps />);
    expect(container.querySelector(".delivery-scenes")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("PRD drafting after a human decision")).toBeInTheDocument();
  });
});
