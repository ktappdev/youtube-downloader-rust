import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DownloadSettings, AudioModeSelector, ActionButtons, ProgressIndicator } from "../components/layout/MainLayout";
import "@testing-library/jest-dom";

describe("DownloadSettings Component", () => {
  it("renders download path input", () => {
    render(<DownloadSettings downloadPath="/test/path" onChangePath={() => {}} onOpenFolder={() => {}} />);
    expect(screen.getByPlaceholderText("Select download path...")).toBeInTheDocument();
    expect(screen.getByDisplayValue("/test/path")).toBeInTheDocument();
  });

  it("renders change path button", () => {
    render(<DownloadSettings downloadPath="" onChangePath={() => {}} onOpenFolder={() => {}} />);
    expect(screen.getByRole("button", { name: "Change Path" })).toBeInTheDocument();
  });

  it("renders open button", () => {
    render(<DownloadSettings downloadPath="" onChangePath={() => {}} onOpenFolder={() => {}} />);
    expect(screen.getByRole("button", { name: /Open/ })).toBeInTheDocument();
  });

  it("calls onChangePath when change path button is clicked", () => {
    const handleChangePath = vi.fn();
    render(<DownloadSettings downloadPath="" onChangePath={handleChangePath} onOpenFolder={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Change Path" }));
    expect(handleChangePath).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenFolder when open button is clicked", () => {
    const handleOpenFolder = vi.fn();
    render(<DownloadSettings downloadPath="" onChangePath={() => {}} onOpenFolder={handleOpenFolder} />);
    fireEvent.click(screen.getByRole("button", { name: /Open/ }));
    expect(handleOpenFolder).toHaveBeenCalledTimes(1);
  });

  it("shows default path when downloadPath is empty", () => {
    render(<DownloadSettings downloadPath="" onChangePath={() => {}} onOpenFolder={() => {}} />);
    expect(screen.getByDisplayValue("~/Downloads/Youtube/Multi")).toBeInTheDocument();
  });
});

describe("AudioModeSelector Component", () => {
  it("renders all three audio mode options", () => {
    render(<AudioModeSelector value="official" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /Official/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Raw/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clean/ })).toBeInTheDocument();
  });

  it("highlights the selected mode", () => {
    render(<AudioModeSelector value="raw" onChange={() => {}} />);
    const rawButton = screen.getByRole("button", { name: /Raw/ });
    // Check for gradient class which indicates selected state
    expect(rawButton).toHaveClass("bg-gradient-to-r");
  });

  it("calls onChange when a mode button is clicked", () => {
    const handleChange = vi.fn();
    render(<AudioModeSelector value="official" onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Clean/ }));
    expect(handleChange).toHaveBeenCalledWith("clean");
  });

  it("disables buttons when disabled prop is set", () => {
    render(<AudioModeSelector value="official" onChange={() => {}} disabled />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});

describe("ActionButtons Component", () => {
  it("renders import CSV button", () => {
    render(<ActionButtons onImportCsv={() => {}} onDownload={() => {}} />);
    expect(screen.getByRole("button", { name: "Import CSV" })).toBeInTheDocument();
  });

  it("renders download button", () => {
    render(<ActionButtons onImportCsv={() => {}} onDownload={() => {}} />);
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
  });

  it("calls onImportCsv when import button is clicked", () => {
    const handleImportCsv = vi.fn();
    render(<ActionButtons onImportCsv={handleImportCsv} onDownload={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Import CSV" }));
    expect(handleImportCsv).toHaveBeenCalledTimes(1);
  });

  it("calls onDownload when download button is clicked", () => {
    const handleDownload = vi.fn();
    render(<ActionButtons onImportCsv={() => {}} onDownload={handleDownload} />);
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });

  it("disables import button when isImportDisabled is true", () => {
    render(<ActionButtons onImportCsv={() => {}} onDownload={() => {}} isImportDisabled />);
    expect(screen.getByRole("button", { name: "Import CSV" })).toBeDisabled();
  });

  it("disables download button when isDownloadDisabled is true", () => {
    render(<ActionButtons onImportCsv={() => {}} onDownload={() => {}} isDownloadDisabled />);
    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
  });
});

describe("ProgressIndicator Component", () => {
  it("renders progress bar", () => {
    render(<ProgressIndicator progress={50} status="Downloading..." currentItem={1} itemCount={10} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("displays status text", () => {
    render(<ProgressIndicator progress={50} status="Downloading..." currentItem={1} itemCount={10} />);
    expect(screen.getByText("Downloading...")).toBeInTheDocument();
  });

  it("displays item counter", () => {
    render(<ProgressIndicator progress={50} status="Downloading..." currentItem={3} itemCount={10} />);
    // Updated to match new format "3 / 10"
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("updates progress bar width", () => {
    render(<ProgressIndicator progress={75} status="" currentItem={0} itemCount={0} />);
    const progressBar = screen.getByRole("progressbar");
    const innerBar = progressBar.firstElementChild;
    expect(innerBar).toHaveStyle({ width: "75%" });
  });

  it("does not show counter when itemCount is 0", () => {
    render(<ProgressIndicator progress={0} status="" currentItem={0} itemCount={0} />);
    expect(screen.queryByText("0 / 0")).not.toBeInTheDocument();
  });
});
