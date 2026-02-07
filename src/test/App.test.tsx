import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";
import "@testing-library/jest-dom";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("App Component", () => {
  it("renders YouTube Downloader title", () => {
    render(<App />);
    expect(screen.getByText("YouTube Downloader")).toBeInTheDocument();
  });

  it("renders input field", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Enter a name...")).toBeInTheDocument();
  });

  it("renders greet button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Greet" })).toBeInTheDocument();
  });

  it("updates name state on input change", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter a name...");
    fireEvent.change(input, { target: { value: "Test User" } });
    expect(input).toHaveValue("Test User");
  });
});
