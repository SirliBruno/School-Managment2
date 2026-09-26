/**
 * Teacher Entity and Domain Types
 */

export interface Teacher {
  id: string;
  fullName: string;
  nationalId: string;
  mobileNumber: string;
  email?: string | null;
  jobTitle: string;
  employmentType: string;
  teachingField: string;
  specialization: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  archivedAt?: string | null;
  archiveReason?: string | null;
}

export type TeacherInsertInput = Omit<
  Teacher,
  "id" | "createdAt" | "updatedAt" | "isArchived" | "archivedAt" | "archiveReason"
>;

export type TeacherUpdateInput = Partial<TeacherInsertInput>;

export interface TeacherFilterOptions {
  search?: string;
  isArchived?: boolean;
  specialization?: string;
  employmentType?: string;
  teachingField?: string;
  sortBy?: "fullName" | "createdAt" | "specialization";
  sortOrder?: "asc" | "desc";
}

export interface TeacherValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Normalizes Arabic text by unifying alef, taa marbuta, and removing tashkeel
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    // Remove diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Unify Alef
    .replace(/[إأآٱ]/g, "ا")
    // Unify Taa Marbuta / Haa
    .replace(/ة/g, "ه")
    // Unify Yaa / Alef Maksura
    .replace(/ى/g, "ي")
    // Clean redundant spaces
    .replace(/\s+/g, " ");
}

/**
 * Validates and normalizes Saudi mobile number
 * Accepts: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX, 9665XXXXXXXX
 * Returns normalized 05XXXXXXXX or null if invalid
 */
export function normalizeSaudiMobile(phone: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/^00/, "+");

  if (/^\+9665\d{8}$/.test(cleaned)) {
    return "0" + cleaned.substring(4);
  }
  if (/^9665\d{8}$/.test(cleaned)) {
    return "0" + cleaned.substring(3);
  }
  if (/^05\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^5\d{8}$/.test(cleaned)) {
    return "0" + cleaned;
  }

  return null;
}

/**
 * Validates Saudi National ID / Iqama
 * Must be 10 digits starting with 1 (Saudi Citizen) or 2 (Resident)
 */
export function validateNationalId(id: string): boolean {
  if (!id) return false;
  const trimmed = id.trim();
  if (!/^[12]\d{9}$/.test(trimmed)) {
    return false;
  }
  return true;
}

/**
 * Validates complete Teacher form fields
 */
export function validateTeacherInput(
  data: Partial<TeacherInsertInput>,
  isUpdate = false
): TeacherValidationResult {
  const errors: Record<string, string> = {};

  // Full Name
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = "الاسم الرباعي مطلوب";
  } else {
    const parts = data.fullName.trim().split(/\s+/);
    if (parts.length < 2) {
      errors.fullName = "يرجى كتابة الاسم الثلاثي أو الرباعي كاملاً";
    } else if (data.fullName.trim().length < 6) {
      errors.fullName = "الاسم قصير جداً وغير مكتمل";
    }
  }

  // National ID
  if (!isUpdate || data.nationalId !== undefined) {
    if (!data.nationalId || !data.nationalId.trim()) {
      errors.nationalId = "رقم الهوية الوطنية أو الإقامة مطلوب";
    } else if (!validateNationalId(data.nationalId)) {
      errors.nationalId = "رقم الهوية غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 1 أو 2";
    }
  }

  // Mobile Number
  if (!isUpdate || data.mobileNumber !== undefined) {
    if (!data.mobileNumber || !data.mobileNumber.trim()) {
      errors.mobileNumber = "رقم الجوال مطلوب للتواصل والإشعارات";
    } else {
      const normalizedMobile = normalizeSaudiMobile(data.mobileNumber);
      if (!normalizedMobile) {
        errors.mobileNumber = "صيغة رقم الجوال غير صحيحة، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
      }
    }
  }

  // Email (optional)
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Standard Specialization options in Saudi Schools
 */
export const SPECIALIZATIONS_LIST = [
  "اللغة العربية",
  "التربية الإسلامية",
  "الرياضيات",
  "العلوم",
  "اللغة الإنجليزية",
  "الدراسات الاجتماعية",
  "الفيزياء",
  "الكيمياء",
  "الأحياء",
  "الحاسب الآلي والذكاء الاصطناعي",
  "التربية الفنية",
  "التربية البدنية والدفاع عن النفس",
  "المهارات الحياتية والأسرية",
  "التوجيه الطلابي",
  "إدارة وتنسيق مدرسي",
] as const;

export const EMPLOYMENT_TYPES = [
  "رسمي (معين)",
  "متعاقد",
  "منتدب كلي",
  "منتدب جزئي",
  "مكلف",
] as const;

export const TEACHING_FIELDS = [
  "التعليم العام",
  "الطفولة المبكرة",
  "التعليم الخاص / المسارات",
  "الكادر الإداري المساند",
] as const;
