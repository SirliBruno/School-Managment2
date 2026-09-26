import { describe, it, expect, beforeEach } from "vitest";
import * as XLSX from "xlsx";
import {
  TeacherImportService,
  type ColumnMapping,
} from "@/services/teacherImportService";
import { TeachersRepository } from "@/repositories/teachersRepository";

describe("TeacherImportService (Excel Parser, Plan Review & Undo)", () => {
  let service: TeacherImportService;
  let repo: TeachersRepository;

  beforeEach(() => {
    repo = new TeachersRepository();
    service = new TeacherImportService(
      repo,
      { logAction: async () => ({} as any) } as any
    );
  });

  // Helper to create in-memory XLSX buffer
  const createMockExcelBuffer = (data: Record<string, unknown>[]): ArrayBuffer => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "كشف المعلمات");
    return XLSX.write(wb, { type: "array", bookType: "xlsx" });
  };

  it("should parse Excel ArrayBuffer correctly and extract headers & rows", async () => {
    const mockData = [
      {
        "اسم المعلمة": "أ. جواهر بنت فهد الدوسري",
        "السجل المدني": "1011223344",
        "رقم الجوال": "0559988776",
        "التخصص": "الرياضيات",
      },
    ];

    const buffer = createMockExcelBuffer(mockData);
    const parsed = await service.parseExcelBuffer(buffer, "test.xlsx");

    expect(parsed.sheetName).toBe("كشف المعلمات");
    expect(parsed.headers).toContain("اسم المعلمة");
    expect(parsed.headers).toContain("السجل المدني");
    expect(parsed.rows.length).toBe(1);
  });

  it("should auto-detect Arabic column mappings", () => {
    const headers = [
      "م",
      "اسم المعلمة",
      "السجل المدني",
      "رقم الجوال",
      "مادة التدريس",
      "نوع العقد",
    ];

    const mapping = service.autoDetectMapping(headers);

    expect(mapping.fullName).toBe("اسم المعلمة");
    expect(mapping.nationalId).toBe("السجل المدني");
    expect(mapping.mobileNumber).toBe("رقم الجوال");
    expect(mapping.specialization).toBe("مادة التدريس");
    expect(mapping.employmentType).toBe("نوع العقد");
  });

  it("should generate import preview plan with new, updated, and ignored rows", async () => {
    const rawRows = [
      // Valid New Teacher
      {
        fullName: "أ. طرفة بنت ناصر السبيعي",
        nationalId: "1099881122",
        mobileNumber: "0509988776",
        specialization: "تاريخ",
      },
      // Invalid National ID
      {
        fullName: "أ. نورة الغامدي",
        nationalId: "3087654321", // starts with 3 (invalid)
        mobileNumber: "0551122334",
        specialization: "علوم",
      },
      // Missing Name
      {
        fullName: "",
        nationalId: "1087654322",
        mobileNumber: "0551122334",
        specialization: "عربي",
      },
    ];

    const mapping: ColumnMapping = {
      fullName: "fullName",
      nationalId: "nationalId",
      mobileNumber: "mobileNumber",
      specialization: "specialization",
    };

    const plan = await service.generateImportPlan(rawRows, mapping, "test.xlsx");

    expect(plan.newTeachers.length).toBe(1);
    expect(plan.newTeachers[0].data.fullName).toBe("أ. طرفة بنت ناصر السبيعي");
    expect(plan.ignoredRows.length).toBe(2);
    expect(plan.ignoredRows.some((r) => r.reason.includes("غير صحيح"))).toBe(true);
    expect(plan.ignoredRows.some((r) => r.reason.includes("فارغ"))).toBe(true);
  });

  it("should execute import and support complete Undo Import", async () => {
    const rawRows = [
      {
        fullName: "أ. نوال بنت محمد العتيبي",
        nationalId: "1077665544",
        mobileNumber: "0543322110",
        specialization: "كيمياء",
      },
    ];

    const mapping: ColumnMapping = {
      fullName: "fullName",
      nationalId: "nationalId",
      mobileNumber: "mobileNumber",
      specialization: "specialization",
    };

    const plan = await service.generateImportPlan(rawRows, mapping, "test_import.xlsx");
    const execution = await service.executeImport(plan, {
      userId: "usr-1",
      userName: "الوكيلة",
      userRole: "vice_principal",
    });

    expect(execution.status).toBe("completed");
    expect(execution.createdCount).toBe(1);

    // Verify teacher exists in repository
    const found = await repo.getByNationalId("1077665544");
    expect(found).not.toBeNull();
    expect(found?.fullName).toBe("أ. نوال بنت محمد العتيبي");

    // Perform Undo Import
    const undoRes = await service.undoImport(execution.operationId);
    expect(undoRes.success).toBe(true);

    // Verify teacher is removed by undo
    const afterUndo = await repo.getByNationalId("1077665544");
    expect(afterUndo).toBeNull();
  });
});
