import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/Avatar";

describe("Avatar UI Component", () => {
  it("generates correct initials from full name", () => {
    render(<Avatar name="نورة السالم" />);
    expect(screen.getByText("نالسالم".slice(0, 1) + "ا"[0])).toBeInTheDocument();
  });

  it("renders status dot when status is provided", () => {
    render(<Avatar name="سارة المنصور" status="online" />);
    expect(screen.getByLabelText("الحالة: online")).toBeInTheDocument();
  });
});
