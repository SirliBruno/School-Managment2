import {
  teachersRepository,
  type ITeachersRepository,
} from "@/repositories/teachersRepository";
import {
  auditLogService,
  type AuditLogService,
} from "@/services/auditLogService";
import {
  type Teacher,
  type TeacherFilterOptions,
  type TeacherInsertInput,
  type TeacherUpdateInput,
  normalizeSaudiMobile,
  validateTeacherInput,
} from "@/types/teacher";

export interface ServiceActor {
  userId: string;
  userName: string;
  userRole: string;
}

export class TeacherService {
  constructor(
    private readonly repo: ITeachersRepository = teachersRepository,
    private readonly auditService: AuditLogService = auditLogService
  ) {}

  /**
   * Retrieves teachers list with optional filtering and search
   */
  async getTeachers(filter?: TeacherFilterOptions): Promise<Teacher[]> {
    return this.repo.getAll(filter);
  }

  /**
   * Retrieves single teacher by ID
   */
  async getTeacherById(id: string): Promise<Teacher | null> {
    return this.repo.getById(id);
  }

  /**
   * Creates a new teacher with full validation, normalization, and audit logging
   */
  async createTeacher(
    input: TeacherInsertInput,
    actor?: ServiceActor
  ): Promise<{ success: boolean; teacher?: Teacher; errors?: Record<string, string> }> {
    // 1. Validate Form Input
    const validation = validateTeacherInput(input, false);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // 2. Normalize Mobile Number
    const normalizedMobile = normalizeSaudiMobile(input.mobileNumber);
    if (!normalizedMobile) {
      return {
        success: false,
        errors: { mobileNumber: "صيغة رقم الجوال غير صالحة" },
      };
    }

    // 3. Check for Duplicate National ID
    const existingWithId = await this.repo.getByNationalId(input.nationalId.trim());
    if (existingWithId) {
      return {
        success: false,
        errors: {
          nationalId: `رقم الهوية مسجل مسبقاً للمعلمة (${existingWithId.fullName})`,
        },
      };
    }

    // 4. Save to Repository
    const preparedInput: TeacherInsertInput = {
      ...input,
      fullName: input.fullName.trim(),
      nationalId: input.nationalId.trim(),
      mobileNumber: normalizedMobile,
      email: input.email?.trim() || null,
      jobTitle: input.jobTitle || "معلمة",
      employmentType: input.employmentType || "رسمي (معين)",
      teachingField: input.teachingField || "التعليم العام",
      specialization: input.specialization || "عام",
    };

    const createdTeacher = await this.repo.create(preparedInput);

    // 5. Audit Logging
    if (actor) {
      await this.auditService.logAction({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        action: "record.create",
        entity: "teacher",
        entityId: createdTeacher.id,
        metadata: {
          fullName: createdTeacher.fullName,
          nationalId: createdTeacher.nationalId,
          specialization: createdTeacher.specialization,
        },
      });
    }

    return { success: true, teacher: createdTeacher };
  }

  /**
   * Updates teacher details with validation and duplicate prevention
   */
  async updateTeacher(
    id: string,
    input: TeacherUpdateInput,
    actor?: ServiceActor
  ): Promise<{ success: boolean; teacher?: Teacher; errors?: Record<string, string> }> {
    // 1. Check existence
    const existing = await this.repo.getById(id);
    if (!existing) {
      return {
        success: false,
        errors: { general: "لم يتم العثور على المعلمة المحددة" },
      };
    }

    // 2. Validate Input
    const validation = validateTeacherInput(input, true);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // 3. If National ID is changing, check uniqueness
    if (input.nationalId && input.nationalId.trim() !== existing.nationalId) {
      const duplicate = await this.repo.getByNationalId(input.nationalId.trim());
      if (duplicate && duplicate.id !== id) {
        return {
          success: false,
          errors: { nationalId: "رقم الهوية مسجل مسبقاً لمعلمة أخرى" },
        };
      }
    }

    // 4. Normalize mobile if provided
    let normalizedMobile = input.mobileNumber;
    if (input.mobileNumber) {
      const norm = normalizeSaudiMobile(input.mobileNumber);
      if (!norm) {
        return {
          success: false,
          errors: { mobileNumber: "صيغة رقم الجوال غير صالحة" },
        };
      }
      normalizedMobile = norm;
    }

    // 5. Perform Update
    const updatedTeacher = await this.repo.update(id, {
      ...input,
      ...(input.fullName ? { fullName: input.fullName.trim() } : {}),
      ...(input.nationalId ? { nationalId: input.nationalId.trim() } : {}),
      ...(normalizedMobile ? { mobileNumber: normalizedMobile } : {}),
      ...(input.email !== undefined ? { email: input.email?.trim() || null } : {}),
    });

    // 6. Audit Logging
    if (actor) {
      await this.auditService.logAction({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        action: "record.update",
        entity: "teacher",
        entityId: id,
        metadata: {
          updatedFields: Object.keys(input),
          fullName: updatedTeacher.fullName,
        },
      });
    }

    return { success: true, teacher: updatedTeacher };
  }

  /**
   * Soft-deletes (archives) a teacher with a documented reason
   */
  async archiveTeacher(
    id: string,
    reason: string,
    actor?: ServiceActor
  ): Promise<{ success: boolean; teacher?: Teacher; error?: string }> {
    if (!reason || !reason.trim()) {
      return { success: false, error: "سبب الأرشفة إلزامي لتوثيق الإجراء الإداري" };
    }

    const teacher = await this.repo.archive(id, reason.trim());

    if (actor) {
      await this.auditService.logAction({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        action: "record.archive",
        entity: "teacher",
        entityId: id,
        metadata: {
          fullName: teacher.fullName,
          reason: reason.trim(),
        },
      });
    }

    return { success: true, teacher };
  }

  /**
   * Restores an archived teacher back to active duty
   */
  async restoreTeacher(
    id: string,
    actor?: ServiceActor
  ): Promise<{ success: boolean; teacher?: Teacher; error?: string }> {
    const teacher = await this.repo.restore(id);

    if (actor) {
      await this.auditService.logAction({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        action: "record.restore",
        entity: "teacher",
        entityId: id,
        metadata: {
          fullName: teacher.fullName,
        },
      });
    }

    return { success: true, teacher };
  }
}

export const teacherService = new TeacherService();
