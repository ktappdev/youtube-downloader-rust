import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MainLayout, MainLayoutHeader, MainLayoutFooter } from "../components/layout/MainLayout";
import "@testing-library/jest-dom";

describe("MainLayout Component", () => {
  it("renders layout with children content", () => {
    render(
      <MainLayout>
        <p>Main content</p>
      </MainLayout>
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders layout with header", () => {
    render(
      <MainLayout header={<MainLayoutHeader title="Test Title" />}>
        <p>Content</p>
      </MainLayout>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders layout with footer", () => {
    render(
      <MainLayout footer={<MainLayoutFooter>Footer content</MainLayoutFooter>}>
        <p>Content</p>
      </MainLayout>
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("renders layout with header, children, and footer", () => {
    render(
      <MainLayout
        header={<MainLayoutHeader title="Lyricut YT Downloader" description="Download videos easily" />}
        footer={<MainLayoutFooter>© 2024</MainLayoutFooter>}
      >
        <p>Download content here</p>
      </MainLayout>
    );
    expect(screen.getByText("Lyricut YT Downloader")).toBeInTheDocument();
    expect(screen.getByText("Download videos easily")).toBeInTheDocument();
    expect(screen.getByText("Download content here")).toBeInTheDocument();
    expect(screen.getByText("© 2024")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MainLayout className="custom-layout">
        <p>Content</p>
      </MainLayout>
    );
    const layout = container.firstElementChild;
    expect(layout).toHaveClass("custom-layout");
  });
});

describe("MainLayoutHeader Component", () => {
  it("renders header with title", () => {
    render(<MainLayoutHeader title="Header Title" />);
    expect(screen.getByText("Header Title")).toBeInTheDocument();
  });

  it("renders header with title and description", () => {
    render(
      <MainLayoutHeader
        title="Header Title"
        description="Header description"
      />
    );
    expect(screen.getByText("Header Title")).toBeInTheDocument();
    expect(screen.getByText("Header description")).toBeInTheDocument();
  });

  it("renders header with actions", () => {
    render(
      <MainLayoutHeader
        title="Header"
        actions={<button>Action</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders custom children instead of title/description", () => {
    render(
      <MainLayoutHeader>
        <div>Custom header content</div>
      </MainLayoutHeader>
    );
    expect(screen.getByText("Custom header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<MainLayoutHeader className="custom-header" title="Title" />);
    const header = container.firstElementChild;
    expect(header).toHaveClass("custom-header");
  });
});

describe("MainLayoutFooter Component", () => {
  it("renders footer with children", () => {
    render(<MainLayoutFooter>Footer text</MainLayoutFooter>);
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });

  it("renders footer with multiple children", () => {
    render(
      <MainLayoutFooter>
        <span>Left content</span>
        <span>Right content</span>
      </MainLayoutFooter>
    );
    expect(screen.getByText("Left content")).toBeInTheDocument();
    expect(screen.getByText("Right content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<MainLayoutFooter className="custom-footer">Footer</MainLayoutFooter>);
    const footer = container.firstElementChild;
    expect(footer).toHaveClass("custom-footer");
  });
});
