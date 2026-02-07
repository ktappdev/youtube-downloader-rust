import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import "@testing-library/jest-dom";

describe("Card Component", () => {
  it("renders Card component", () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders CardHeader and CardTitle", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders CardContent", () => {
    render(
      <Card>
        <CardContent>Content goes here</CardContent>
      </Card>
    );
    expect(screen.getByText("Content goes here")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Card className="custom-card">
        <CardContent>Custom card</CardContent>
      </Card>
    );
    const card = screen.getByText("Custom card").closest('[class*="rounded-lg"]');
    expect(card).toHaveClass("custom-card");
  });
});
