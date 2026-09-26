import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "@/components/ui/Alert";

describe("Alert UI Component", () => {
  it("renders alert title and description", () => {
    render(<Alert title="تنبيه نظام" description="يرجى مراجعة سجلات اليوم" />);
    expect(screen.getByText("تنبيه نظام")).toBeInTheDocument();
    expect(screen.getByText("يرجى مراجعة سجلات اليوم")).toBeInTheDocument();
  });

  it("handles dismissal when dismissible is true", () => {
    const handleDismiss = vi.fn();
    render(<Alert title="تنبيه قابل للإغلاق" dismissible onDismiss={handleDismiss} />);

    const closeBtn = screen.getByLabelText("إغلاق التنبيه");
    fireEvent.click(closeBtn);

    expect(handleDismiss).toHaveBeenCalled();
    expect(screen.queryByText("تنبيه قابل للإغلاق")).not.toBeInTheDocument();
  });
});
