import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { DownloadProvider, useDownloadStore } from "../store/DownloadStore";
import "@testing-library/jest-dom";

function TestComponent() {
  const { url, mode, downloadPath, setUrl, setMode, setDownloadPath, reset } = useDownloadStore();

  return (
    <div>
      <div data-testid="url">{url}</div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="downloadPath">{downloadPath}</div>
      <button onClick={() => setUrl("https://youtube.com/watch?v=abc")}>Set URL</button>
      <button onClick={() => setMode("audio")}>Set Audio Mode</button>
      <button onClick={() => setMode("video")}>Set Video Mode</button>
      <button onClick={() => setMode("playlist")}>Set Playlist Mode</button>
      <button onClick={() => setDownloadPath("/downloads")}>Set Path</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

describe("DownloadStore", () => {
  afterEach(() => {
    cleanup();
  });

  it("provides default state", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    expect(screen.getByTestId("url")).toHaveTextContent("");
    expect(screen.getByTestId("mode")).toHaveTextContent("video");
    expect(screen.getByTestId("downloadPath")).toHaveTextContent("");
  });

  it("sets URL", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set URL"));
    expect(screen.getByTestId("url")).toHaveTextContent("https://youtube.com/watch?v=abc");
  });

  it("sets mode to audio", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set Audio Mode"));
    expect(screen.getByTestId("mode")).toHaveTextContent("audio");
  });

  it("sets mode to video", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set Video Mode"));
    expect(screen.getByTestId("mode")).toHaveTextContent("video");
  });

  it("sets mode to playlist", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set Playlist Mode"));
    expect(screen.getByTestId("mode")).toHaveTextContent("playlist");
  });

  it("sets download path", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set Path"));
    expect(screen.getByTestId("downloadPath")).toHaveTextContent("/downloads");
  });

  it("resets state to defaults", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set URL"));
    fireEvent.click(screen.getByText("Set Audio Mode"));
    fireEvent.click(screen.getByText("Set Path"));
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByTestId("url")).toHaveTextContent("");
    expect(screen.getByTestId("mode")).toHaveTextContent("video");
    expect(screen.getByTestId("downloadPath")).toHaveTextContent("");
  });

  it("throws error when used outside provider", () => {
    expect(() => useDownloadStore()).toThrow();
  });

  it("updates multiple state values sequentially", () => {
    render(
      <DownloadProvider>
        <TestComponent />
      </DownloadProvider>
    );
    fireEvent.click(screen.getByText("Set URL"));
    fireEvent.click(screen.getByText("Set Audio Mode"));
    fireEvent.click(screen.getByText("Set Path"));
    expect(screen.getByTestId("url")).toHaveTextContent("https://youtube.com/watch?v=abc");
    expect(screen.getByTestId("mode")).toHaveTextContent("audio");
    expect(screen.getByTestId("downloadPath")).toHaveTextContent("/downloads");
  });
});
