import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("applies variant class and renders children", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toContain("button--danger");
  });

  it("when isLoading is true: disables the button, sets aria-busy, applies loading class", () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Submit
      </Button>,
    );
    const btn = screen.getByRole("button", {
      name: "Submit",
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect(btn.className).toContain("button--loading");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards disabled prop even without isLoading", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", {
      name: "Disabled",
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
