import { describe, it, expect } from "vitest";
import {
  convertArabicDigits,
  normalizeNationalId,
  isValidSaudiNationalId,
  normalizeSaudiPhone,
  formatPhoneForDisplay,
  normalizeArabicName,
  getThreePartName,
} from "@/utils/normalization";

describe("Normalization Utilities", () => {
  it("converts Arabic/Eastern numerals to Western numerals", () => {
    expect(convertArabicDigits("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
    expect(convertArabicDigits("هوية: ١٠٨٧٦٥٤٣٢١")).toBe("هوية: 1087654321");
  });

  it("normalizes national ID and strips Excel float suffix (.0)", () => {
    expect(normalizeNationalId("1087654321.0")).toBe("1087654321");
    expect(normalizeNationalId("1087654321.00")).toBe("1087654321");
    expect(normalizeNationalId(" 108-765-4321 ")).toBe("1087654321");
    expect(normalizeNationalId("١٠٨٧٦٥٤٣٢١")).toBe("1087654321");
  });

  it("validates Saudi national ID / Iqama format", () => {
    expect(isValidSaudiNationalId("1087654321")).toBe(true); // Saudi citizen (1)
    expect(isValidSaudiNationalId("2087654321")).toBe(true); // Resident (2)
    expect(isValidSaudiNationalId("3087654321")).toBe(false); // Invalid start digit
    expect(isValidSaudiNationalId("108765432")).toBe(false); // 9 digits
    expect(isValidSaudiNationalId("10876543210")).toBe(false); // 11 digits
  });

  it("standardizes Saudi phone numbers to 9665XXXXXXXX", () => {
    expect(normalizeSaudiPhone("0501234567")).toBe("966501234567");
    expect(normalizeSaudiPhone("+966501234567")).toBe("966501234567");
    expect(normalizeSaudiPhone("00966501234567")).toBe("966501234567");
    expect(normalizeSaudiPhone("501234567")).toBe("966501234567");
    expect(normalizeSaudiPhone("966501234567")).toBe("966501234567");
    expect(normalizeSaudiPhone("٠٥٠١٢٣٤٥٦٧")).toBe("966501234567");
  });

  it("formats 9665XXXXXXXX back to 05XXXXXXXX for domestic display", () => {
    expect(formatPhoneForDisplay("966501234567")).toBe("0501234567");
    expect(formatPhoneForDisplay("0501234567")).toBe("0501234567");
  });

  it("normalizes Arabic names (Alef, Taa Marbuta, Yaa, Tashkeel)", () => {
    expect(normalizeArabicName("أَحْمَدُ")).toBe("احمد");
    expect(normalizeArabicName("إبراهيم")).toBe("ابراهيم");
    expect(normalizeArabicName("آمنة")).toBe("امنه");
    expect(normalizeArabicName("فاطمة")).toBe("فاطمه");
    expect(normalizeArabicName("مُنى")).toBe("مني");
    expect(normalizeArabicName("هـدى")).toBe("هدي"); // Tatweel
  });

  it("extracts three-part name token for matching", () => {
    expect(getThreePartName("أ. فاطمة بنت صالح بن محمد العمري")).toBe("فاطمه صالح محمد");
    expect(getThreePartName("نورة محمد القحطاني")).toBe("نوره محمد القحطاني");
  });
});
