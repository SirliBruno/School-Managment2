import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button UI Component", () => {
  it("renders button label correctly", () => {
    render(<Button>حفظ البيانات</Button>);
    expect(screen.getByText("حفظ البيانات")).toBeInTheDocument();
  });

  it("handles disabled state properly", () => {
    render(<Button disabled>زر معطل</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("disables button when isLoading is true", () => {
    render(<Button isLoading>جاري المعالجة</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
