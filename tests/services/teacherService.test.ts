import { describe, it, expect, beforeEach } from "vitest";
import { TeacherService } from "@/services/teacherService";
import {
  validateNationalId,
  normalizeSaudiMobile,
  normalizeArabicText,
  type Teacher,
  type TeacherInsertInput,
} from "@/types/teacher";
import type { ITeachersRepository } from "@/repositories/teachersRepository";

class MockTeachersRepository implements ITeachersRepository {
  public teachers: Teacher[] = [];

  async getAll(filter?: any): Promise<Teacher[]> {
    let result = [...this.teachers];
    if (filter?.isArchived !== undefined) {
      result = result.filter((t) => t.isArchived === filter.isArchived);
    }
    return result;
  }

  async getById(id: string): Promise<Teacher | null> {
    return this.teachers.find((t) => t.id === id) || null;
  }

  async getByNationalId(nationalId: string): Promise<Teacher | null> {
    return this.teachers.find((t) => t.nationalId === nationalId) || null;
  }

  async create(payload: TeacherInsertInput): Promise<Teacher> {
    const item: Teacher = {
      id: `mock-${this.teachers.length + 1}`,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      archivedAt: null,
      archiveReason: null,
    };
    this.teachers.unshift(item);
    return item;
  }

  async update(id: string, payload: any): Promise<Teacher> {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Not found");
    const updated = {
      ...this.teachers[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    this.teachers[index] = updated;
    return updated;
  }

  async archive(id: string, reason: string): Promise<Teacher> {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Not found");
    const updated: Teacher = {
      ...this.teachers[index],
      isArchived: true,
      archivedAt: new Date().toISOString(),
      archiveReason: reason,
    };
    this.teachers[index] = updated;
    return updated;
  }

  async restore(id: string): Promise<Teacher> {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Not found");
    const updated: Teacher = {
      ...this.teachers[index],
      isArchived: false,
      archivedAt: null,
      archiveReason: null,
    };
    this.teachers[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.teachers = this.teachers.filter((t) => t.id !== id);
  }
}

describe("Teacher Domain & Validation", () => {
  it("should validate correct Saudi national IDs", () => {
    expect(validateNationalId("1087654321")).toBe(true);
    expect(validateNationalId("2087654321")).toBe(true);
    // Invalid IDs
    expect(validateNationalId("3087654321")).toBe(false); // starts with 3
    expect(validateNationalId("108765432")).toBe(false); // 9 digits
    expect(validateNationalId("10876543210")).toBe(false); // 11 digits
    expect(validateNationalId("abc1234567")).toBe(false);
  });

  it("should normalize Saudi mobile phone formats to 05XXXXXXXX", () => {
    expect(normalizeSaudiMobile("0501234567")).toBe("0501234567");
    expect(normalizeSaudiMobile("501234567")).toBe("0501234567");
    expect(normalizeSaudiMobile("+966501234567")).toBe("0501234567");
    expect(normalizeSaudiMobile("00966501234567")).toBe("0501234567");
    expect(normalizeSaudiMobile("966501234567")).toBe("0501234567");
    // Invalid phone
    expect(normalizeSaudiMobile("0112345678")).toBeNull();
    expect(normalizeSaudiMobile("12345")).toBeNull();
  });

  it("should normalize Arabic search text correctly", () => {
    expect(normalizeArabicText("أحمد")).toBe("احمد");
    expect(normalizeArabicText("إبراهيم")).toBe("ابراهيم");
    expect(normalizeArabicText("فاطمة")).toBe("فاطمه");
    expect(normalizeArabicText("منى")).toBe("مني");
    expect(normalizeArabicText("مُعَلِّمَةٌ")).toBe("معلمه");
  });
});

describe("TeacherService Operations", () => {
  let mockRepo: MockTeachersRepository;
  let service: TeacherService;

  beforeEach(() => {
    mockRepo = new MockTeachersRepository();
    // Pass mock repo and dummy audit service
    service = new TeacherService(mockRepo, { logAction: async () => ({} as any) } as any);
  });

  it("should create teacher successfully with validated fields", async () => {
    const res = await service.createTeacher({
      fullName: "أ. فاطمة بنت صالح العمري",
      nationalId: "1087654321",
      mobileNumber: "0501234567",
      email: "fatima@school.edu.sa",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "اللغة العربية",
    });

    expect(res.success).toBe(true);
    expect(res.teacher).toBeDefined();
    expect(res.teacher?.fullName).toBe("أ. فاطمة بنت صالح العمري");
    expect(res.teacher?.mobileNumber).toBe("0501234567");
    expect(mockRepo.teachers.length).toBe(1);
  });

  it("should reject duplicate national ID", async () => {
    await service.createTeacher({
      fullName: "أ. فاطمة بنت صالح العمري",
      nationalId: "1087654321",
      mobileNumber: "0501234567",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "اللغة العربية",
    });

    const duplicateRes = await service.createTeacher({
      fullName: "أ. منيرة بنت عبدالله",
      nationalId: "1087654321",
      mobileNumber: "0559876543",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "رياضيات",
    });

    expect(duplicateRes.success).toBe(false);
    expect(duplicateRes.errors?.nationalId).toContain("مسجل مسبقاً");
  });

  it("should archive teacher with a specified reason", async () => {
    const created = await service.createTeacher({
      fullName: "أ. ريم بنت إبراهيم الخالدي",
      nationalId: "1023456789",
      mobileNumber: "0541122334",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "إسلاميات",
    });

    const archiveRes = await service.archiveTeacher(
      created.teacher!.id,
      "نقل إلى مدرسة أخرى"
    );

    expect(archiveRes.success).toBe(true);
    expect(archiveRes.teacher?.isArchived).toBe(true);
    expect(archiveRes.teacher?.archiveReason).toBe("نقل إلى مدرسة أخرى");
  });

  it("should restore an archived teacher", async () => {
    const created = await service.createTeacher({
      fullName: "أ. هدى بنت سليمان المنصور",
      nationalId: "1076543210",
      mobileNumber: "0567788990",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "علوم",
    });

    await service.archiveTeacher(created.teacher!.id, "إجازة طويلة");
    const restoreRes = await service.restoreTeacher(created.teacher!.id);

    expect(restoreRes.success).toBe(true);
    expect(restoreRes.teacher?.isArchived).toBe(false);
    expect(restoreRes.teacher?.archiveReason).toBeNull();
  });
});
