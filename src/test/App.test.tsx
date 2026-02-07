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

  it("renders download settings section", () => {
    render(<App />);
    expect(screen.getByText("Download Settings")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select download path...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change Path" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Folder" })).toBeInTheDocument();
  });

  it("renders input section", () => {
    render(<App />);
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Paste links or song names (one per line)...")).toBeInTheDocument();
  });

  it("renders audio mode selector", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Official Audio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Raw Audio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clean Audio" })).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Import CSV" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
  });

  it("renders reset all button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Reset All" })).toBeInTheDocument();
  });

  it("updates input text on change", () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText("Paste links or song names (one per line)...");
    fireEvent.change(textarea, { target: { value: "https://youtube.com/watch?v=test\nAnother song" } });
    expect(textarea).toHaveValue("https://youtube.com/watch?v=test\nAnother song");
  });
});
