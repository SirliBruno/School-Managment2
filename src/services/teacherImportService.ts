import * as XLSX from "xlsx";
import {
  teachersRepository,
  type ITeachersRepository,
} from "@/repositories/teachersRepository";
import {
  auditLogService,
  type AuditLogService,
} from "@/services/auditLogService";
import {
  deduplicationService,
  type DeduplicationEngine,
} from "@/services/deduplicationService";
import type { Teacher, TeacherInsertInput } from "@/types/teacher";
import {
  convertArabicDigits,
  isValidSaudiNationalId,
  normalizeArabicName,
  normalizeNationalId,
  normalizeSaudiPhone,
  formatPhoneForDisplay,
} from "@/utils/normalization";
import type { ServiceActor } from "./teacherService";

export interface ColumnMapping {
  nationalId?: string;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  specialization?: string;
  teachingField?: string;
  jobTitle?: string;
  employmentType?: string;
}

export interface ParsedRow {
  rowIndex: number;
  raw: Record<string, unknown>;
  mapped: {
    fullName?: string;
    nationalId?: string;
    mobileNumber?: string;
    email?: string;
    specialization?: string;
    teachingField?: string;
    jobTitle?: string;
    employmentType?: string;
  };
  errors: string[];
}

export interface ImportPreviewPlan {
  fileName: string;
  totalRows: number;
  newTeachers: Array<{ row: ParsedRow; data: TeacherInsertInput }>;
  updatedTeachers: Array<{ row: ParsedRow; existing: Teacher; changes: Partial<Teacher> }>;
  restoredTeachers: Array<{ row: ParsedRow; existing: Teacher }>;
  ignoredRows: Array<{ row: ParsedRow; reason: string }>;
  mergedClustersCount: number;
}

export interface ImportExecutionResult {
  operationId: string;
  fileName: string;
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  restoredCount: number;
  mergedCount: number;
  failedCount: number;
  status: "completed" | "reverted" | "failed";
}



// In-memory operations log for offline / fast undo support
interface ImportOperationSnapshot {
  id: string;
  fileName: string;
  totalRows: number;
  createdIds: string[];
  updatedBackups: Teacher[];
  restoredIds: string[];
  createdAt: string;
  status: "completed" | "reverted";
  actor?: ServiceActor;
}

const importOperationsStore: ImportOperationSnapshot[] = [];

export class TeacherImportService {
  constructor(
    private readonly repo: ITeachersRepository = teachersRepository,
    private readonly auditService: AuditLogService = auditLogService,
    private readonly dedupEngine: DeduplicationEngine = deduplicationService
  ) {}

  /**
   * Reads an Excel ArrayBuffer and returns available headers and raw row data
   */
  async parseExcelBuffer(
    buffer: ArrayBuffer,
    fileName = "teachers_import.xlsx"
  ): Promise<{ headers: string[]; rows: Record<string, unknown>[]; sheetName: string }> {
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("ملف Excel فارغ ولا يحتوي على أوراق عمل صالحة");
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      raw: false,
    });

    if (rawJson.length === 0) {
      throw new Error("ورقة العمل فارغة ولا تحتوي على بيانات معلمات");
    }

    // Extract headers from first non-empty rows
    const headerSet = new Set<string>();
    for (const r of rawJson) {
      for (const k of Object.keys(r)) {
        if (k && !k.startsWith("__EMPTY")) {
          headerSet.add(k.trim());
        }
      }
    }

    return {
      headers: Array.from(headerSet),
      rows: rawJson,
      sheetName: firstSheetName,
    };
  }

  /**
   * Intelligently maps arbitrary Arabic/English column headers to system keys
   */
  autoDetectMapping(headers: string[]): ColumnMapping {
    const mapping: ColumnMapping = {};

    const findMatch = (candidates: string[]) => {
      return headers.find((h) => {
        const normH = normalizeArabicName(h.toLowerCase()).trim();
        if (normH.length < 2) return false;
        return candidates.some((c) => {
          const normC = normalizeArabicName(c.toLowerCase()).trim();
          return normH === normC || normH.includes(normC);
        });
      });
    };

    // National ID
    mapping.nationalId = findMatch([
      "رقم الهوية",
      "السجل المدني",
      "رقم السجل",
      "الهوية الوطنية",
      "رقم الهويه",
      "هوية",
      "national_id",
      "nationalId",
      "id_number",
    ]);

    // Full Name
    mapping.fullName = findMatch([
      "اسم المعلمة",
      "الاسم الكامل",
      "اسم المعلمه",
      "اسم الموظفة",
      "الاسم الرباعي",
      "الاسم",
      "full_name",
      "fullName",
      "teacher_name",
    ]);

    // Mobile Number
    mapping.mobileNumber = findMatch([
      "رقم الجوال",
      "الجوال",
      "الهاتف",
      "رقم الهاتف",
      "جوال المعلمة",
      "mobile",
      "phone",
      "mobile_number",
    ]);

    // Specialization
    mapping.specialization = findMatch([
      "التخصص",
      "التخصص التدريسي",
      "المادة",
      "مادة التدريس",
      "التخصص العلمي",
      "specialization",
      "subject",
    ]);

    // Teaching Field
    mapping.teachingField = findMatch([
      "مجال التدريس",
      "المجال",
      "المرحلة",
      "قطاع التدريس",
      "teaching_field",
      "field",
    ]);

    // Job Title
    mapping.jobTitle = findMatch([
      "المسمى الوظيفي",
      "الوظيفة",
      "المسمى",
      "job_title",
      "title",
    ]);

    // Employment Type
    mapping.employmentType = findMatch([
      "حالة التوظيف",
      "نوع التوظيف",
      "حالة العمل",
      "نوع العقد",
      "employment_type",
    ]);

    // Email
    mapping.email = findMatch([
      "البريد الإلكتروني",
      "البريد",
      "الإيميل",
      "الايميل",
      "email",
    ]);

    return mapping;
  }

  /**
   * Generates Import Plan preview by comparing parsed rows with existing database records
   */
  async generateImportPlan(
    rawRows: Record<string, unknown>[],
    mapping: ColumnMapping,
    fileName = "teachers.xlsx"
  ): Promise<ImportPreviewPlan> {
    const existingTeachers = await this.repo.getAll();
    const existingByNationalId = new Map<string, Teacher>();
    for (const t of existingTeachers) {
      existingByNationalId.set(normalizeNationalId(t.nationalId), t);
    }

    const candidateRows: ParsedRow[] = [];
    const ignoredRows: Array<{ row: ParsedRow; reason: string }> = [];

    // 1. Parse and validate each row using mapping
    for (let i = 0; i < rawRows.length; i++) {
      const raw = rawRows[i];
      const errors: string[] = [];

      const rawName = mapping.fullName ? String(raw[mapping.fullName] || "") : "";
      const rawId = mapping.nationalId ? String(raw[mapping.nationalId] || "") : "";
      const rawMobile = mapping.mobileNumber ? String(raw[mapping.mobileNumber] || "") : "";
      const rawEmail = mapping.email ? String(raw[mapping.email] || "") : "";
      const rawSpec = mapping.specialization ? String(raw[mapping.specialization] || "") : "";
      const rawField = mapping.teachingField ? String(raw[mapping.teachingField] || "") : "";
      const rawJob = mapping.jobTitle ? String(raw[mapping.jobTitle] || "") : "";
      const rawEmp = mapping.employmentType ? String(raw[mapping.employmentType] || "") : "";

      // Clean & Normalize
      const fullName = rawName.trim();
      const nationalId = normalizeNationalId(rawId);
      const mobileNumber = normalizeSaudiPhone(rawMobile);

      if (!fullName) {
        errors.push("اسم المعلمة غير موجود أو فارغ");
      } else if (fullName.length < 5) {
        errors.push("اسم المعلمة قصير جداً أو غير صالح");
      }

      if (!nationalId) {
        errors.push("رقم الهوية الوطنية مفقود أو فارغ");
      } else if (!isValidSaudiNationalId(nationalId)) {
        errors.push(`رقم الهوية (${nationalId}) غير صحيح (يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2)`);
      }

      const parsed: ParsedRow = {
        rowIndex: i + 2, // Excel row 2 is usually first data row
        raw,
        mapped: {
          fullName,
          nationalId,
          mobileNumber: formatPhoneForDisplay(mobileNumber) || rawMobile.trim(),
          email: rawEmail.trim() || undefined,
          specialization: rawSpec.trim() || "عام",
          teachingField: rawField.trim() || "التعليم العام",
          jobTitle: rawJob.trim() || "معلمة",
          employmentType: rawEmp.trim() || "رسمي (معين)",
        },
        errors,
      };

      if (errors.length > 0) {
        ignoredRows.push({ row: parsed, reason: errors.join(" • ") });
      } else {
        candidateRows.push(parsed);
      }
    }

    // 2. Intra-file Deduplication check using DeduplicationEngine
    const candidatesForDedup = candidateRows.map((r) => ({
      ...r.mapped,
      fullName: r.mapped.fullName!,
      nationalId: r.mapped.nationalId!,
      mobileNumber: r.mapped.mobileNumber || "",
      originalRow: r,
    }));

    const dedupResult = this.dedupEngine.clusterCandidates(candidatesForDedup);

    // If clusters found inside the file, keep the merged primary and flag duplicates as merged/ignored
    const dedupedCandidates: ParsedRow[] = [];
    let mergedClustersCount = 0;

    for (const cluster of dedupResult.clusters) {
      mergedClustersCount++;
      const mergedItem = this.dedupEngine.mergeRecords(cluster.primary, cluster.duplicates);
      dedupedCandidates.push((mergedItem as any).originalRow);

      for (const dup of cluster.duplicates) {
        ignoredRows.push({
          row: (dup as any).originalRow,
          reason: `مكرر داخل الملف مع الصف ${(mergedItem as any).originalRow.rowIndex} (${cluster.reason})`,
        });
      }
    }

    for (const item of dedupResult.uniqueRecords) {
      dedupedCandidates.push((item as any).originalRow);
    }

    // 3. Classify into New, Updated, Restored against existing DB
    const newTeachers: Array<{ row: ParsedRow; data: TeacherInsertInput }> = [];
    const updatedTeachers: Array<{ row: ParsedRow; existing: Teacher; changes: Partial<Teacher> }> = [];
    const restoredTeachers: Array<{ row: ParsedRow; existing: Teacher }> = [];

    for (const c of dedupedCandidates) {
      const nid = c.mapped.nationalId!;
      const existing = existingByNationalId.get(nid);

      if (!existing) {
        // New Record
        newTeachers.push({
          row: c,
          data: {
            fullName: c.mapped.fullName!,
            nationalId: nid,
            mobileNumber: c.mapped.mobileNumber || "0500000000",
            email: c.mapped.email || null,
            jobTitle: c.mapped.jobTitle || "معلمة",
            employmentType: c.mapped.employmentType || "رسمي",
            teachingField: c.mapped.teachingField || "التعليم العام",
            specialization: c.mapped.specialization || "عام",
          },
        });
      } else if (existing.isArchived) {
        // Restored from archive
        restoredTeachers.push({
          row: c,
          existing,
        });
      } else {
        // Active teacher: check if any fields have new details
        const changes: Partial<Teacher> = {};
        if (!existing.email && c.mapped.email) changes.email = c.mapped.email;
        if ((!existing.mobileNumber || existing.mobileNumber === "0500000000") && c.mapped.mobileNumber) {
          changes.mobileNumber = c.mapped.mobileNumber;
        }
        if (existing.specialization === "عام" && c.mapped.specialization && c.mapped.specialization !== "عام") {
          changes.specialization = c.mapped.specialization;
        }
        if (c.mapped.jobTitle && existing.jobTitle !== c.mapped.jobTitle) {
          changes.jobTitle = c.mapped.jobTitle;
        }

        if (Object.keys(changes).length > 0) {
          updatedTeachers.push({ row: c, existing, changes });
        } else {
          ignoredRows.push({
            row: c,
            reason: "المعلمة مسجلة مسبقاً بنفس البيانات دون أي تعديلات",
          });
        }
      }
    }

    return {
      fileName,
      totalRows: rawRows.length,
      newTeachers,
      updatedTeachers,
      restoredTeachers,
      ignoredRows,
      mergedClustersCount,
    };
  }

  /**
   * Executes the import plan into the database with snapshot saving for Undo
   */
  async executeImport(
    plan: ImportPreviewPlan,
    actor?: ServiceActor
  ): Promise<ImportExecutionResult> {
    const operationId = `imp-op-${Date.now()}`;
    const createdIds: string[] = [];
    const updatedBackups: Teacher[] = [];
    const restoredIds: string[] = [];
    let failedCount = 0;

    // 1. Insert New Teachers
    for (const item of plan.newTeachers) {
      try {
        const created = await this.repo.create(item.data);
        createdIds.push(created.id);
        if (actor) {
          await this.auditService.logAction({
            userId: actor.userId,
            userName: actor.userName,
            userRole: actor.userRole,
            action: "record.create",
            entity: "teacher",
            entityId: created.id,
            metadata: { source: "excel_import", fileName: plan.fileName },
          });
        }
      } catch {
        failedCount++;
      }
    }

    // 2. Update Existing Teachers
    for (const item of plan.updatedTeachers) {
      try {
        updatedBackups.push(item.existing);
        await this.repo.update(item.existing.id, item.changes);
        if (actor) {
          await this.auditService.logAction({
            userId: actor.userId,
            userName: actor.userName,
            userRole: actor.userRole,
            action: "record.update",
            entity: "teacher",
            entityId: item.existing.id,
            metadata: { source: "excel_import", updatedFields: Object.keys(item.changes) },
          });
        }
      } catch {
        failedCount++;
      }
    }

    // 3. Restore Archived Teachers
    for (const item of plan.restoredTeachers) {
      try {
        await this.repo.restore(item.existing.id);
        restoredIds.push(item.existing.id);
        if (actor) {
          await this.auditService.logAction({
            userId: actor.userId,
            userName: actor.userName,
            userRole: actor.userRole,
            action: "record.restore",
            entity: "teacher",
            entityId: item.existing.id,
            metadata: { source: "excel_import", reason: "استعادة تلقائية عبر كشف الاستيراد المعتمد" },
          });
        }
      } catch {
        failedCount++;
      }
    }

    // 4. Save Operation Snapshot for Undo
    const snapshot: ImportOperationSnapshot = {
      id: operationId,
      fileName: plan.fileName,
      totalRows: plan.totalRows,
      createdIds,
      updatedBackups,
      restoredIds,
      createdAt: new Date().toISOString(),
      status: "completed",
      actor,
    };
    importOperationsStore.unshift(snapshot);

    return {
      operationId,
      fileName: plan.fileName,
      totalRows: plan.totalRows,
      createdCount: createdIds.length,
      updatedCount: updatedBackups.length,
      restoredCount: restoredIds.length,
      mergedCount: plan.mergedClustersCount,
      failedCount,
      status: "completed",
    };
  }

  /**
   * Reverts (Undoes) an import operation
   */
  async undoImport(
    operationId: string,
    actor?: ServiceActor
  ): Promise<{ success: boolean; message: string }> {
    const snapshot = importOperationsStore.find((op) => op.id === operationId);
    if (!snapshot) {
      throw new Error("لم يتم العثور على سجل عملية الاستيراد المحددة أو تم التراجع عنها مسبقاً");
    }

    if (snapshot.status === "reverted") {
      throw new Error("تم التراجع عن هذه العملية بالفعل");
    }

    // 1. Delete created records
    for (const id of snapshot.createdIds) {
      try {
        await this.repo.delete(id);
      } catch (e) {
        console.error("Failed to delete created record during undo:", e);
      }
    }

    // 2. Restore previous values of updated records
    for (const backup of snapshot.updatedBackups) {
      try {
        await this.repo.update(backup.id, {
          email: backup.email,
          mobileNumber: backup.mobileNumber,
          specialization: backup.specialization,
          jobTitle: backup.jobTitle,
        });
      } catch (e) {
        console.error("Failed to revert updated record during undo:", e);
      }
    }

    // 3. Re-archive restored records
    for (const id of snapshot.restoredIds) {
      try {
        await this.repo.archive(id, "إعادة للأرشيف عبر التراجع عن عملية الاستيراد (Undo Import)");
      } catch (e) {
        console.error("Failed to re-archive during undo:", e);
      }
    }

    snapshot.status = "reverted";

    if (actor) {
      await this.auditService.logAction({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        action: "record.delete",
        entity: "system",
        entityId: operationId,
        metadata: {
          actionType: "undo_import",
          operationId,
          fileName: snapshot.fileName,
          revertedCreatedCount: snapshot.createdIds.length,
        },
      });
    }

    return {
      success: true,
      message: `تم التراجع بنجاح عن استيراد (${snapshot.fileName}): تم حذف ${snapshot.createdIds.length} معلمة، واستعادة النسخ السابقة.`,
    };
  }

  /**
   * Retrieves list of previous import operations
   */
  getOperationsHistory(): ImportOperationSnapshot[] {
    return [...importOperationsStore];
  }
}

export const teacherImportService = new TeacherImportService();
