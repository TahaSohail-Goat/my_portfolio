import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  AccessibleButton,
  AccessibleLink,
  Decorative,
  FluidContainer,
  ResponsiveGrid,
} from "@/components/ui/accessible-primitives";

describe("accessible interaction primitives", () => {
  it("keeps buttons and links native, named, keyboard operable, and target-sized", async () => {
    const user = userEvent.setup();
    const onButton = vi.fn();
    const onLink = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <div data-presentation-tier="basic">
        <AccessibleButton onClick={onButton}>Open projects</AccessibleButton>
        <AccessibleLink href="#contact" onClick={onLink}>Contact Taha</AccessibleLink>
      </div>,
    );

    const button = screen.getByRole("button", { name: "Open projects" });
    const link = screen.getByRole("link", { name: "Contact Taha" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
    expect(link).toHaveAttribute("href", "#contact");
    expect(button).toHaveClass("interaction-target", "focus-ring");
    expect(link).toHaveClass("interaction-target", "focus-ring");

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onButton).toHaveBeenCalledOnce();
    expect(onLink).toHaveBeenCalledOnce();
  });

  it("provides fluid layout hooks and excludes decorative descendants", () => {
    render(<FluidContainer><ResponsiveGrid><Decorative as="div"><button>Star</button></Decorative></ResponsiveGrid></FluidContainer>);
    expect(screen.getByText("Star").closest("[data-decorative]"))
      .toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("button", { name: "Star" })).not.toBeInTheDocument();
    expect(screen.getByText("Star").parentElement?.parentElement).toHaveClass("responsive-grid");
  });
});
