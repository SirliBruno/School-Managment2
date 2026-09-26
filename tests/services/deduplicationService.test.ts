import { describe, it, expect } from "vitest";
import { deduplicationService } from "@/services/deduplicationService";

describe("DeduplicationService", () => {
  it("normalizes Saudi phone numbers starting with 05 to international +966 format", () => {
    const raw = "0512345678";
    const normalized = deduplicationService.normalizePhoneNumber(raw);
    expect(normalized).toBe("+966512345678");
  });

  it("normalizes national ID by stripping whitespaces", () => {
    const raw = " 1098 765 432 ";
    const normalized = deduplicationService.normalizeNationalId(raw);
    expect(normalized).toBe("1098765432");
  });

  it("identifies duplicate items based on composite key", () => {
    const candidates = [
      { nationalId: "1001", name: "نورة" },
      { nationalId: "1002", name: "سارة" },
      { nationalId: "1001", name: "نورة مكررة" },
    ];

    const result = deduplicationService.findDuplicates({
      candidates,
      keys: ["nationalId"],
    });

    expect(result.unique.length).toBe(2);
    expect(result.duplicates.length).toBe(1);
    expect(result.duplicates[0].nationalId).toBe("1001");
  });
});
