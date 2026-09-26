import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Combobox } from "@/components/ui/Combobox";

describe("Combobox UI Component", () => {
  const options = [
    { value: "1", label: "نورة السالم", description: "لغة عربية" },
    { value: "2", label: "سارة العتيبي", description: "رياضيات" },
    { value: "3", label: "فاطمة الدوسري", description: "علوم" },
  ];

  it("renders with placeholder when no value is selected", () => {
    render(<Combobox options={options} placeholder="اختر معلمة..." />);
    expect(screen.getByText("اختر معلمة...")).toBeInTheDocument();
  });

  it("opens listbox on click and allows selecting an option", () => {
    const handleChange = vi.fn();
    render(<Combobox options={options} onChange={handleChange} />);

    const combobox = screen.getByRole("combobox");
    fireEvent.click(combobox);

    const option = screen.getByText("سارة العتيبي");
    expect(option).toBeInTheDocument();

    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith("2");
  });

  it("filters options based on search input", () => {
    render(<Combobox options={options} />);

    const combobox = screen.getByRole("combobox");
    fireEvent.click(combobox);

    const searchInput = screen.getByPlaceholderText("اكتب للبحث...");
    fireEvent.change(searchInput, { target: { value: "فاطمة" } });

    expect(screen.getByText("فاطمة الدوسري")).toBeInTheDocument();
    expect(screen.queryByText("نورة السالم")).not.toBeInTheDocument();
  });
});
