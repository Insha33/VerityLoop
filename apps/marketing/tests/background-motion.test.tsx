import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/marketing/Hero";
import HomePage from "@/app/page";

describe("decorative background motion", () => {
  it("keeps the signal grid out of the accessibility tree", () => {
    const { container } = render(<Hero />);
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("has no pause control: motion stops only for reduced-motion users", () => {
    render(<Hero />);
    expect(screen.queryByRole("button", { name: /background animation/i })).not.toBeInTheDocument();
  });

  it("ends the page with a rising grid layered behind the signup section and footer", () => {
    const { container } = render(<HomePage />);
    const grid = container.querySelector("[data-variant='footer']");
    expect(grid).toHaveAttribute("aria-hidden", "true");
    expect(grid?.parentElement).toBe(container.querySelector("footer")?.parentElement);
    expect(grid?.parentElement).toContainElement(container.querySelector("#waitlist") as HTMLElement);
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
