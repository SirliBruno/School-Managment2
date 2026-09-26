import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

describe("Timeline UI Component", () => {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "رصد غياب يومي",
      timestamp: "08:00 ص",
      description: "تم تسجيل الحالة في السجل اليومي",
      status: "completed",
    },
    {
      id: "2",
      title: "بانتظار الرد",
      timestamp: "09:00 ص",
      status: "current",
      badgeText: "إشعار نشط",
    },
  ];

  it("renders all timeline items with titles and timestamps", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("رصد غياب يومي")).toBeInTheDocument();
    expect(screen.getByText("08:00 ص")).toBeInTheDocument();
    expect(screen.getByText("بانتظار الرد")).toBeInTheDocument();
    expect(screen.getByText("إشعار نشط")).toBeInTheDocument();
  });
});
