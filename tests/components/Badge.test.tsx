import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge UI Component", () => {
  it("renders badge text correctly", () => {
    render(<Badge variant="success">نشط</Badge>);
    expect(screen.getByText("نشط")).toBeInTheDocument();
  });

  it("applies danger styling class for danger variant", () => {
    const { container } = render(<Badge variant="danger">حسم معتمد</Badge>);
    expect(container.firstChild).toHaveClass("bg-rose-50");
  });
});
