import { teachersRepository, ITeachersRepository } from "@/repositories/teachersRepository";
import type { Teacher } from "@/types/database";

export interface RawTeacherRow {
  nationalId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  specialization?: string;
  jobTitle?: string;
}

export interface TeacherImportResult {
  totalProcessed: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
  errors: Array<{ rowNumber: number; reason: string }>;
  importedTeachers: Teacher[];
}

export interface ITeacherImportService {
  parseAndValidate(fileBuffer: ArrayBuffer): Promise<RawTeacherRow[]>;
  importTeachers(rows: RawTeacherRow[]): Promise<TeacherImportResult>;
}

export class TeacherImportService implements ITeacherImportService {
  constructor(
    private readonly repo: ITeachersRepository = teachersRepository
  ) {}

  async parseAndValidate(_fileBuffer: ArrayBuffer): Promise<RawTeacherRow[]> {
    // Architecture scaffold: Excel parsing to be implemented in respective sprint
    return [];
  }

  async importTeachers(_rows: RawTeacherRow[]): Promise<TeacherImportResult> {
    // Architecture scaffold: Import logic to be implemented in respective sprint
    return {
      totalProcessed: 0,
      importedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      errors: [],
      importedTeachers: [],
    };
  }
}

export const teacherImportService = new TeacherImportService();
