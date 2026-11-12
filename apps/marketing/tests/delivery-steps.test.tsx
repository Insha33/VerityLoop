import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeliverySteps } from "@/components/marketing/DeliverySteps";

afterEach(() => vi.useRealTimers());

describe("interactive delivery steps", () => {
  const scenes = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>(".delivery-scene")].map((scene) => scene.dataset.active);
  const steps = () => within(screen.getByRole("list", { name: "Approval steps" })).getAllByRole("button");

  it("starts on the first step with its scene showing", () => {
    const { container } = render(<DeliverySteps />);
    expect(steps().map((step) => step.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    expect(scenes(container)).toEqual(["true", "false", "false"]);
  });

  it("follows the mouse, a tap or keyboard focus to the matching scene", () => {
    const { container } = render(<DeliverySteps />);
    const [first, second, third] = steps();
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
    fireEvent.pointerEnter(steps()[2], { pointerType: "touch" });
    expect(scenes(container)).toEqual(["true", "false", "false"]);
  });

  it("moves between steps with arrow keys and wraps around", () => {
    const { container } = render(<DeliverySteps />);
    fireEvent.keyDown(steps()[0], { key: "ArrowUp" });
    expect(scenes(container)).toEqual(["false", "false", "true"]);
  });

  it("exposes only the visible scene; hidden scenes are aria-hidden and inert", () => {
    const { container } = render(<DeliverySteps />);
    const [visible, ...hidden] = container.querySelectorAll<HTMLElement>(".delivery-scene");
    expect(visible).toHaveAttribute("aria-hidden", "false");
    for (const scene of hidden) {
      expect(scene).toHaveAttribute("aria-hidden", "true");
      expect(scene).toHaveAttribute("inert");
    }
    // The publish controls stay out of reach until their step is shown.
    expect(screen.queryByRole("button", { name: /Publish 3 drafts/ })).not.toBeInTheDocument();
  });

  it("lets you pick Jira, publish, see the created tickets, and reset", () => {
    vi.useFakeTimers();
    render(<DeliverySteps />);
    fireEvent.click(steps()[2]);
    fireEvent.click(screen.getByRole("button", { name: "Jira" }));
    expect(screen.getByRole("button", { name: "Jira" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /Publish 3 drafts/ }));
    expect(screen.getByRole("button", { name: "Publishing…" })).toBeDisabled();
    act(() => { vi.advanceTimersByTime(700); });
    expect(screen.getByRole("button", { name: /Published to Jira/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("VL-142");
    fireEvent.click(screen.getByRole("button", { name: /Reset demo/ }));
    expect(screen.getByRole("button", { name: /Publish 3 drafts/ })).toBeEnabled();
  });

  it("resets the publish demo when you leave the step", () => {
    vi.useFakeTimers();
    render(<DeliverySteps />);
    fireEvent.click(steps()[2]);
    fireEvent.click(screen.getByRole("button", { name: /Publish 3 drafts/ }));
    act(() => { vi.advanceTimersByTime(700); });
    fireEvent.click(steps()[0]);
    fireEvent.click(steps()[2]);
    expect(screen.getByRole("button", { name: /Publish 3 drafts/ })).toBeEnabled();
  });
});
