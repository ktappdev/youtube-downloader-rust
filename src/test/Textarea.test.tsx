import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "../components/ui/Textarea";
import "@testing-library/jest-dom";

describe("Textarea Component", () => {
  it("renders textarea element", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter text here..." />);
    expect(screen.getByPlaceholderText("Enter text here...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-textarea" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-textarea");
  });

  it("renders with default value", () => {
    render(<Textarea value="Initial value" readOnly />);
    expect(screen.getByRole("textbox")).toHaveValue("Initial value");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
