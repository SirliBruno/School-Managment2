import type { Teacher, TeacherInsertInput } from "@/types/teacher";
import {
  normalizeArabicName,
  normalizeNationalId,
  normalizeSaudiPhone,
  getThreePartName,
  getNameTokens,
} from "@/utils/normalization";

/**
 * Union-Find (Disjoint Set Union) data structure for clustering records
 */
export class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array.from({ length: size }, () => 0);
  }

  find(i: number): number {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]); // Path compression
    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return false;

    // Union by rank
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }
}

export type DeduplicationLevel =
  | "LEVEL_1_ID"
  | "LEVEL_2_NATIONAL_ID"
  | "LEVEL_3_NAME_AND_PHONE"
  | "LEVEL_4_THREE_PART_NAME_AND_SPECIALIZATION"
  | "LEVEL_5_EXACT_NAME";

export interface DuplicateCluster<T> {
  clusterId: number;
  primary: T;
  duplicates: T[];
  matchedLevel: DeduplicationLevel;
  reason: string;
}

export interface DeduplicationAnalysis<T> {
  uniqueRecords: T[];
  clusters: DuplicateCluster<T>[];
  totalCandidates: number;
  duplicateCount: number;
}

export interface CandidateTeacher {
  id?: string;
  fullName: string;
  nationalId: string;
  mobileNumber: string;
  email?: string | null;
  jobTitle?: string | null;
  employmentType?: string | null;
  teachingField?: string | null;
  specialization?: string | null;
  createdAt?: string;
  [key: string]: unknown;
}

export class DeduplicationEngine {
  /**
   * Clusters candidate teachers using multi-level matching and Union-Find
   */
  clusterCandidates<T extends CandidateTeacher>(candidates: T[]): DeduplicationAnalysis<T> {
    const n = candidates.length;
    if (n <= 1) {
      return {
        uniqueRecords: candidates,
        clusters: [],
        totalCandidates: n,
        duplicateCount: 0,
      };
    }

    const uf = new UnionFind(n);
    const matchReasons = new Map<string, { level: DeduplicationLevel; reason: string }>();

    // Helper to connect and record reason
    const connect = (i: number, j: number, level: DeduplicationLevel, reason: string) => {
      if (uf.union(i, j)) {
        const root = uf.find(i);
        matchReasons.set(`${root}`, { level, reason });
      }
    };

    // Lookup indices for fast matching
    const idMap = new Map<string, number>();
    const nationalIdMap = new Map<string, number>();
    const namePhoneMap = new Map<string, number>();
    const threePartSpecMap = new Map<string, number>();
    const exactNameMap = new Map<string, number>();

    for (let i = 0; i < n; i++) {
      const c = candidates[i];
      const normId = c.id?.trim();
      const normNationalId = normalizeNationalId(c.nationalId);
      const coreTokens = getNameTokens(c.fullName);
      const coreName = coreTokens.join(" ");
      const normPhone = normalizeSaudiPhone(c.mobileNumber);
      const threePart = coreTokens.slice(0, 3).join(" ");
      const normSpec = normalizeArabicName(c.specialization || "");

      // Level 1: Internal ID match
      if (normId) {
        if (idMap.has(normId)) {
          connect(i, idMap.get(normId)!, "LEVEL_1_ID", `تطابق المعرف الداخلي: ${normId}`);
        } else {
          idMap.set(normId, i);
        }
      }

      // Level 2: National ID match (Highest authority)
      if (normNationalId && normNationalId.length === 10) {
        if (nationalIdMap.has(normNationalId)) {
          connect(
            i,
            nationalIdMap.get(normNationalId)!,
            "LEVEL_2_NATIONAL_ID",
            `تطابق رقم الهوية الوطنية: ${normNationalId}`
          );
        } else {
          nationalIdMap.set(normNationalId, i);
        }
      }

      // Level 3: Normalized Name + Phone
      if (coreName && normPhone) {
        const key = `${coreName}::${normPhone}`;
        if (namePhoneMap.has(key)) {
          connect(
            i,
            namePhoneMap.get(key)!,
            "LEVEL_3_NAME_AND_PHONE",
            `تطابق الاسم ورقم الجوال (${normPhone})`
          );
        } else {
          namePhoneMap.set(key, i);
        }
      }

      // Level 4: Three-part Name + Specialization
      if (threePart.length >= 4 && normSpec) {
        const key = `${threePart}::${normSpec}`;
        if (threePartSpecMap.has(key)) {
          connect(
            i,
            threePartSpecMap.get(key)!,
            "LEVEL_4_THREE_PART_NAME_AND_SPECIALIZATION",
            `تطابق الاسم الثلاثي (${threePart}) مع التخصص (${normSpec})`
          );
        } else {
          threePartSpecMap.set(key, i);
        }
      }

      // Level 5: Exact Full Normalized Name (minimum 3 tokens)
      if (coreTokens.length >= 3) {
        if (exactNameMap.has(coreName)) {
          connect(
            i,
            exactNameMap.get(coreName)!,
            "LEVEL_5_EXACT_NAME",
            `تطابق الاسم المنقح كاملاً: ${coreName}`
          );
        } else {
          exactNameMap.set(coreName, i);
        }
      }
    }

    // Group candidates by their root in UnionFind
    const groups = new Map<number, T[]>();
    for (let i = 0; i < n; i++) {
      const root = uf.find(i);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(candidates[i]);
    }

    const uniqueRecords: T[] = [];
    const clusters: DuplicateCluster<T>[] = [];

    groups.forEach((members, root) => {
      if (members.length === 1) {
        uniqueRecords.push(members[0]);
      } else {
        // Sort to pick primary: oldest record (with existing ID or earliest createdAt), or the one with most complete data
        const sorted = [...members].sort((a, b) => {
          if (a.id && !b.id) return -1;
          if (!a.id && b.id) return 1;
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });

        const primary = sorted[0];
        const duplicates = sorted.slice(1);
        const matchInfo = matchReasons.get(`${root}`) || {
          level: "LEVEL_2_NATIONAL_ID",
          reason: "تطابق بيانات الكادر",
        };

        clusters.push({
          clusterId: root,
          primary,
          duplicates,
          matchedLevel: matchInfo.level,
          reason: matchInfo.reason,
        });
      }
    });

    const duplicateCount = clusters.reduce((acc, c) => acc + c.duplicates.length, 0);

    return {
      uniqueRecords,
      clusters,
      totalCandidates: n,
      duplicateCount,
    };
  }

  /**
   * Merge rules:
   * 1. Retain the oldest / original record as the base.
   * 2. Fill empty fields only; do not overwrite existing valid data.
   */
  mergeRecords<T extends CandidateTeacher>(primary: T, duplicates: T[]): T {
    const merged: T = { ...primary };

    for (const dup of duplicates) {
      if (!merged.email && dup.email) merged.email = dup.email;
      if ((!merged.jobTitle || merged.jobTitle === "معلمة") && dup.jobTitle) {
        merged.jobTitle = dup.jobTitle;
      }
      if (!merged.employmentType && dup.employmentType) {
        merged.employmentType = dup.employmentType;
      }
      if (!merged.teachingField && dup.teachingField) {
        merged.teachingField = dup.teachingField;
      }
      if ((!merged.specialization || merged.specialization === "عام") && dup.specialization) {
        merged.specialization = dup.specialization;
      }
      if (!merged.mobileNumber && dup.mobileNumber) {
        merged.mobileNumber = dup.mobileNumber;
      }
    }

    return merged;
  }
}

export const deduplicationService = new DeduplicationEngine();
