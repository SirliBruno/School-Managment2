import { describe, it, expect, beforeEach } from "vitest";
import { TeachersRepository } from "@/repositories/teachersRepository";

describe("TeachersRepository", () => {
  let repo: TeachersRepository;

  beforeEach(() => {
    repo = new TeachersRepository();
  });

  it("should get active teachers by default filter", async () => {
    const active = await repo.getAll({ isArchived: false });
    expect(active.length).toBeGreaterThan(0);
    expect(active.every((t) => !t.isArchived)).toBe(true);
  });

  it("should filter archived teachers", async () => {
    const archived = await repo.getAll({ isArchived: true });
    expect(archived.every((t) => t.isArchived)).toBe(true);
  });

  it("should perform smart Arabic search", async () => {
    const results = await repo.getAll({ search: "فاطمة" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullName).toContain("فاطمة");
  });

  it("should create, update, archive and restore teacher through repository", async () => {
    const created = await repo.create({
      fullName: "أ. خلود بنت خالد العتيبي",
      nationalId: "1099887766",
      mobileNumber: "0551122334",
      jobTitle: "معلمة",
      employmentType: "رسمي",
      teachingField: "التعليم العام",
      specialization: "فيزياء",
    });

    expect(created.id).toBeDefined();
    expect(created.fullName).toBe("أ. خلود بنت خالد العتيبي");

    // Update
    const updated = await repo.update(created.id, {
      jobTitle: "معلمة أولى",
    });
    expect(updated.jobTitle).toBe("معلمة أولى");

    // Archive
    const archived = await repo.archive(created.id, "إجازة رعاية مولود");
    expect(archived.isArchived).toBe(true);
    expect(archived.archiveReason).toBe("إجازة رعاية مولود");

    // Restore
    const restored = await repo.restore(created.id);
    expect(restored.isArchived).toBe(false);
  });
});
