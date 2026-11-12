import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/marketing/Hero";
import { setBackgroundMotionPaused } from "@/components/marketing/backgroundMotion";

afterEach(() => act(() => setBackgroundMotionPaused(false)));

describe("decorative background motion", () => {
  it("keeps the signal grid out of the accessibility tree", () => {
    const { container } = render(<Hero />);
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("offers one control that pauses and resumes background animation", () => {
    render(<Hero />);
    const toggle = screen.getByRole("button", { name: "Pause background animation" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAccessibleName("Pause background animation");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("hides the evidence callouts from assistive technology because the image alt carries them", () => {
    const { container } = render(<Hero />);
    for (const callout of container.querySelectorAll(".hero-callout")) expect(callout).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: /VerityLoop signal inbox/ })).toBeInTheDocument();
  });

  it("draws a first frame of lit cells as soon as it has a canvas", () => {
    const fillRect = vi.fn();
    const context = { setTransform: vi.fn(), clearRect: vi.fn(), fillRect, fillStyle: "" };
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => context as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 1200, height: 720, top: 0, left: 0, right: 1200, bottom: 720, x: 0, y: 0, toJSON: () => ({}) });
    render(<Hero />);
    expect(getContext).toHaveBeenCalledWith("2d");
    expect(context.clearRect).toHaveBeenCalled();
    expect(fillRect.mock.calls.length).toBeGreaterThan(0);
  });
});
