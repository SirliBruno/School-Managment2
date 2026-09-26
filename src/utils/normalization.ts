/**
 * Data Normalization Utilities for Arabic Text, Saudi IDs, Phones, and Excel values
 */

/**
 * Converts Eastern Arabic numerals (٠-٩) and Persian numerals to Western Arabic numerals (0-9)
 */
export function convertArabicDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return "";
  const str = String(input);
  return str
    .replace(/[٠۰]/g, "0")
    .replace(/[١۱]/g, "1")
    .replace(/[٢۲]/g, "2")
    .replace(/[٣۳]/g, "3")
    .replace(/[٤۴]/g, "4")
    .replace(/[٥۵]/g, "5")
    .replace(/[٦۶]/g, "6")
    .replace(/[٧۷]/g, "7")
    .replace(/[٨۸]/g, "8")
    .replace(/[٩۹]/g, "9");
}

/**
 * Cleans and standardizes National ID from Excel / user input
 * - Converts Arabic digits
 * - Strips trailing .0 from Excel float numbers (e.g. 1087654321.0 -> 1087654321)
 * - Removes non-digits
 * - Returns exact 10 digits or empty string if invalid
 */
export function normalizeNationalId(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return "";
  let val = convertArabicDigits(input).trim();

  // Strip Excel float decimal suffix like .0 or .00
  val = val.replace(/\.0+$/, "");

  // Remove any spaces, hyphens, slashes, or other punctuation
  const digits = val.replace(/\D/g, "");

  return digits;
}

/**
 * Validates whether a normalized national ID conforms to Saudi rules
 * Must be 10 digits starting with 1 (Citizen) or 2 (Resident)
 */
export function isValidSaudiNationalId(id: string): boolean {
  return /^[12]\d{9}$/.test(id);
}

/**
 * Standardizes Saudi mobile phone number to standard format: 9665XXXXXXXX
 * Examples:
 * - 0501234567 -> 966501234567
 * - +966501234567 -> 966501234567
 * - 00966501234567 -> 966501234567
 * - 501234567 -> 966501234567
 */
export function normalizeSaudiPhone(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return "";
  let val = convertArabicDigits(input).trim();

  // Remove Excel decimals
  val = val.replace(/\.0+$/, "");

  // Remove spaces, dashes, parentheses
  let cleaned = val.replace(/[^\d+]/g, "").replace(/^00/, "+");

  if (cleaned.startsWith("+9665") && cleaned.length === 13) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith("9665") && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.startsWith("05") && cleaned.length === 10) {
    return "966" + cleaned.slice(1);
  }
  if (cleaned.startsWith("5") && cleaned.length === 9) {
    return "966" + cleaned;
  }

  // If already pure 9 digits starting with 5 or 12 digits
  if (/^9665\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Converts 9665XXXXXXXX to domestic format 05XXXXXXXX for UI display
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("9665") && cleaned.length === 12) {
    return "0" + cleaned.slice(3);
  }
  if (cleaned.startsWith("05") && cleaned.length === 10) {
    return cleaned;
  }
  return phone;
}

/**
 * Standardizes Arabic names for accurate searching and deduplication:
 * - Removes tashkeel (diacritics)
 * - Removes tatweel / kashida (ـ)
 * - Normalizes alefs (إ, أ, آ, ٱ -> ا)
 * - Normalizes taa marbuta (ة -> ه)
 * - Normalizes yaa (ى -> ي)
 * - Collapses extra whitespace
 */
export function normalizeArabicName(name: string): string {
  if (!name) return "";
  let cleaned = name
    .trim()
    // Remove diacritics
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Remove tatweel
    .replace(/\u0640/g, "")
    // Normalize Alefs
    .replace(/[إأآٱ]/g, "ا")
    // Normalize Taa Marbuta
    .replace(/ة/g, "ه")
    // Normalize Yaa / Alef Maksura
    .replace(/ى/g, "ي")
    // Replace multiple spaces
    .replace(/\s+/g, " ");

  // Strip title/honorific prefix like "أ." or "أ/" or "استاذه"
  cleaned = cleaned.replace(/^(ا[\.\/]|استاذه|الاستاذه|معلمه|المعلمه)\s*/i, "");
  return cleaned.trim();
}

/**
 * Extracts normalized core tokens, removing filler words (بنت, بن)
 */
export function getNameTokens(fullName: string): string[] {
  const normalized = normalizeArabicName(fullName);
  return normalized
    .split(/\s+/)
    .filter((w) => w && w !== "بن" && w !== "بنت");
}

/**
 * Extracts first 3 name tokens for level 4 deduplication
 */
export function getThreePartName(fullName: string): string {
  const tokens = getNameTokens(fullName);
  return tokens.slice(0, 3).join(" ");
}
