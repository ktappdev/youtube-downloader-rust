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
    expect(screen.getAllByText("YouTube Downloader")).toHaveLength(2);
  });

  it("renders URL input field", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Enter YouTube URL...")).toBeInTheDocument();
  });

  it("renders mode selection buttons", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Audio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Video" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Playlist" })).toBeInTheDocument();
  });

  it("renders download path input field", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Select download path...")).toBeInTheDocument();
  });

  it("renders reset button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("updates URL state on input change", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Enter YouTube URL...");
    fireEvent.change(input, { target: { value: "https://youtube.com/watch?v=test" } });
    expect(input).toHaveValue("https://youtube.com/watch?v=test");
  });

  it("updates download path state on input change", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Select download path...");
    fireEvent.change(input, { target: { value: "/Users/downloads" } });
    expect(input).toHaveValue("/Users/downloads");
  });
});
