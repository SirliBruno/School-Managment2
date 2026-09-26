export interface DuplicateCheckParams<T> {
  candidates: T[];
  keys: (keyof T)[];
}

export interface DuplicateReport<T> {
  unique: T[];
  duplicates: T[];
}

export interface IDeduplicationService {
  findDuplicates<T>(params: DuplicateCheckParams<T>): DuplicateReport<T>;
  normalizeNationalId(id: string): string;
  normalizePhoneNumber(phone: string): string;
}

export class DeduplicationService implements IDeduplicationService {
  findDuplicates<T>(params: DuplicateCheckParams<T>): DuplicateReport<T> {
    const seen = new Set<string>();
    const unique: T[] = [];
    const duplicates: T[] = [];

    for (const item of params.candidates) {
      const compositeKey = params.keys.map((k) => String(item[k] ?? "")).join("::");
      if (seen.has(compositeKey)) {
        duplicates.push(item);
      } else {
        seen.add(compositeKey);
        unique.push(item);
      }
    }

    return { unique, duplicates };
  }

  normalizeNationalId(id: string): string {
    return id.trim().replace(/\s+/g, "");
  }

  normalizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^0-9+]/g, "").trim();
    if (cleaned.startsWith("05")) {
      return `+966${cleaned.slice(1)}`;
    }
    return cleaned;
  }
}

export const deduplicationService = new DeduplicationService();
