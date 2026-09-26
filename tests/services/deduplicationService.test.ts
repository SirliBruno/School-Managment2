import { describe, it, expect } from "vitest";
import {
  deduplicationService,
  UnionFind,
  type CandidateTeacher,
} from "@/services/deduplicationService";

describe("UnionFind Algorithm", () => {
  it("should initialize disjoint sets and correctly union and find elements", () => {
    const uf = new UnionFind(5);
    expect(uf.find(0)).toBe(0);
    expect(uf.find(1)).toBe(1);

    uf.union(0, 1);
    expect(uf.find(0)).toBe(uf.find(1));

    uf.union(2, 3);
    uf.union(1, 2);
    // Now 0, 1, 2, 3 are in the same component
    expect(uf.find(3)).toBe(uf.find(0));
    expect(uf.find(4)).not.toBe(uf.find(0));
  });
});

describe("DeduplicationEngine (5-Level Matching)", () => {
  it("should cluster duplicates at Level 2 (National ID Match)", () => {
    const candidates: CandidateTeacher[] = [
      {
        fullName: "أ. فاطمة بنت صالح العمري",
        nationalId: "1087654321",
        mobileNumber: "0501234567",
        specialization: "اللغة العربية",
      },
      {
        fullName: "فاطمة صالح العمري",
        nationalId: "1087654321",
        mobileNumber: "0501234567",
        specialization: "عربي",
      },
    ];

    const result = deduplicationService.clusterCandidates(candidates);
    expect(result.clusters.length).toBe(1);
    expect(result.duplicateCount).toBe(1);
    expect(result.clusters[0].matchedLevel).toBe("LEVEL_2_NATIONAL_ID");
  });

  it("should cluster duplicates at Level 3 (Normalized Name + Mobile Number)", () => {
    const candidates: CandidateTeacher[] = [
      {
        fullName: "أ. نورة بنت محمد القحطاني",
        nationalId: "1098765432",
        mobileNumber: "0551122334",
        specialization: "رياضيات",
      },
      {
        fullName: "نوره محمد القحطاني",
        nationalId: "", // missing national ID
        mobileNumber: "966551122334", // same normalized phone
        specialization: "رياضيات",
      },
    ];

    const result = deduplicationService.clusterCandidates(candidates);
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].matchedLevel).toBe("LEVEL_3_NAME_AND_PHONE");
  });

  it("should cluster duplicates at Level 4 (Three-part Name + Specialization)", () => {
    const candidates: CandidateTeacher[] = [
      {
        fullName: "أ. سارة بنت عبدالعزيز بن صالح التميمي",
        nationalId: "",
        mobileNumber: "0533344556",
        specialization: "اللغة الإنجليزية",
      },
      {
        fullName: "ساره عبدالعزيز صالح الدوسري",
        nationalId: "",
        mobileNumber: "0599988776",
        specialization: "اللغة الإنجليزية",
      },
    ];

    const result = deduplicationService.clusterCandidates(candidates);
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].matchedLevel).toBe("LEVEL_4_THREE_PART_NAME_AND_SPECIALIZATION");
  });

  it("should merge duplicates according to rules (keep base, fill empty fields, no overwrite)", () => {
    const primary: CandidateTeacher = {
      id: "tch-original",
      fullName: "أ. فاطمة بنت صالح العمري",
      nationalId: "1087654321",
      mobileNumber: "0501234567",
      email: null,
      jobTitle: "معلمة",
      employmentType: null,
      teachingField: null,
      specialization: "اللغة العربية",
    };

    const duplicate: CandidateTeacher = {
      fullName: "فاطمة صالح العمري",
      nationalId: "1087654321",
      mobileNumber: "0509999999", // should NOT overwrite existing mobileNumber
      email: "fatimah.omari@school.edu.sa", // SHOULD fill empty email
      jobTitle: "معلمة أولى", // should update default "معلمة"
      employmentType: "رسمي", // SHOULD fill empty employmentType
      teachingField: "التعليم العام", // SHOULD fill empty teachingField
      specialization: "عربي", // should NOT overwrite specific "اللغة العربية"
    };

    const merged = deduplicationService.mergeRecords(primary, [duplicate]);

    expect(merged.id).toBe("tch-original");
    expect(merged.mobileNumber).toBe("0501234567"); // Preserved
    expect(merged.email).toBe("fatimah.omari@school.edu.sa"); // Filled
    expect(merged.employmentType).toBe("رسمي"); // Filled
    expect(merged.teachingField).toBe("التعليم العام"); // Filled
    expect(merged.specialization).toBe("اللغة العربية"); // Preserved
    expect(merged.jobTitle).toBe("معلمة أولى");
  });
});
