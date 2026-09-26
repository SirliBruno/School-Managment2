import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/ui/StatsCard";

describe("StatsCard UI Component", () => {
  it("renders title, value, and subtitle", () => {
    render(<StatsCard title="نسبة الحضور" value="98%" subtitle="الفصل الدراسي الأول" />);
    expect(screen.getByText("نسبة الحضور")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("الفصل الدراسي الأول")).toBeInTheDocument();
  });

  it("renders trend details properly", () => {
    render(
      <StatsCard
        title="الغياب"
        value="5"
        trend={{ value: "+2", direction: "up", label: "مقارنة بالأسبوع السابق" }}
      />
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("مقارنة بالأسبوع السابق")).toBeInTheDocument();
  });
});
