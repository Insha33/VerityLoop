import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContextSources } from "@/components/marketing/ContextSources";

describe("context source details", () => {
  it("shows a source's purpose on hover and dismisses it on Escape", async () => {
    const user = userEvent.setup();
    render(<ContextSources />);
    await user.hover(screen.getByRole("button", { name: "Notion" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Ground product docs");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("makes the purpose available on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<ContextSources />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Notion" });
    expect(trigger).toHaveFocus();
    const tooltip = await screen.findByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    expect(tooltip).toHaveTextContent("Ground product docs");
    await user.tab();
    expect(screen.getByRole("button", { name: "Google Drive" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Index shared files");
  });

  it("lets touch users toggle details and keeps only one source open", async () => {
    const user = userEvent.setup();
    render(<ContextSources />);
    const notion = screen.getByRole("button", { name: "Notion" });
    const granola = screen.getByRole("button", { name: "Granola" });
    await user.pointer({ keys: "[TouchA]", target: notion });
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Ground product docs");
    await user.pointer({ keys: "[TouchA]", target: granola });
    const tooltip = await screen.findByRole("tooltip");
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
    expect(within(tooltip).getByText("Summarize customer calls")).toBeInTheDocument();
    await user.pointer({ keys: "[TouchA]", target: granola });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
