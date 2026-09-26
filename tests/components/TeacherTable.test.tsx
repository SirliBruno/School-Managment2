import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TeacherTable } from "@/components/teachers/TeacherTable";
import type { Teacher } from "@/types/teacher";

describe("TeacherTable Component", () => {
  const mockTeachers: Teacher[] = [
    {
      id: "tch-1",
      fullName: "أ. فاطمة بنت صالح العمري",
      nationalId: "1087654321",
      mobileNumber: "0501234567",
      email: "fatimah@school.edu.sa",
      jobTitle: "معلمة أولى",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "اللغة العربية",
      isArchived: false,
      createdAt: "2026-09-01T00:00:00Z",
      updatedAt: "2026-09-01T00:00:00Z",
    },
    {
      id: "tch-2",
      fullName: "أ. سارة بنت عبدالعزيز التميمي",
      nationalId: "1065432109",
      mobileNumber: "0533344556",
      email: "sarah@school.edu.sa",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "اللغة الإنجليزية",
      isArchived: true,
      archivedAt: "2026-09-20T00:00:00Z",
      archiveReason: "نقل إلى مدرسة أخرى",
      createdAt: "2026-08-25T00:00:00Z",
      updatedAt: "2026-09-20T00:00:00Z",
    },
  ];

  it("should render teacher rows with name, ID, and specialization", () => {
    render(
      <TeacherTable
        teachers={mockTeachers}
        onViewProfile={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
        onRestore={vi.fn()}
      />
    );

    expect(screen.getAllByText("أ. فاطمة بنت صالح العمري").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1087654321").length).toBeGreaterThan(0);
    expect(screen.getAllByText("اللغة العربية").length).toBeGreaterThan(0);
  });

  it("should render empty state when no teachers match", () => {
    render(
      <TeacherTable
        teachers={[]}
        onViewProfile={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
        onRestore={vi.fn()}
      />
    );

    expect(screen.getByText("لا توجد معلمات مسجلات حالياً")).toBeInTheDocument();
  });
});
