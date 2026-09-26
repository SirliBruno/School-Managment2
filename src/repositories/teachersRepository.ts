import { supabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import {
  type Teacher,
  type TeacherFilterOptions,
  type TeacherInsertInput,
  type TeacherUpdateInput,
  normalizeArabicText,
  normalizeSaudiMobile,
} from "@/types/teacher";

export interface ITeachersRepository {
  getAll(filter?: TeacherFilterOptions): Promise<Teacher[]>;
  getById(id: string): Promise<Teacher | null>;
  getByNationalId(nationalId: string): Promise<Teacher | null>;
  create(payload: TeacherInsertInput): Promise<Teacher>;
  update(id: string, payload: TeacherUpdateInput): Promise<Teacher>;
  archive(id: string, reason: string): Promise<Teacher>;
  restore(id: string): Promise<Teacher>;
  delete(id: string): Promise<void>;
}

// Initial mock seeds for offline testing & rapid development
const INITIAL_TEACHERS_SEED: Teacher[] = [
  {
    id: "tch-seed-01",
    fullName: "أ. فاطمة بنت صالح العمري",
    nationalId: "1087654321",
    mobileNumber: "0501234567",
    email: "fatimah.omari@school.edu.sa",
    jobTitle: "معلمة أولى",
    employmentType: "رسمي (معين)",
    teachingField: "التعليم العام",
    specialization: "اللغة العربية",
    isArchived: false,
    archivedAt: null,
    archiveReason: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tch-seed-02",
    fullName: "أ. مريم بنت عبدالله الدوسري",
    nationalId: "1098765432",
    mobileNumber: "0559876543",
    email: "maryam.dosari@school.edu.sa",
    jobTitle: "معلمة",
    employmentType: "رسمي (معين)",
    teachingField: "التعليم العام",
    specialization: "الرياضيات",
    isArchived: false,
    archivedAt: null,
    archiveReason: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tch-seed-03",
    fullName: "أ. ريم بنت إبراهيم الخالدي",
    nationalId: "1023456789",
    mobileNumber: "0541122334",
    email: "reem.khalidi@school.edu.sa",
    jobTitle: "معلمة",
    employmentType: "رسمي (معين)",
    teachingField: "التعليم العام",
    specialization: "التربية الإسلامية",
    isArchived: false,
    archivedAt: null,
    archiveReason: null,
    createdAt: "2026-09-02T08:00:00.000Z",
    updatedAt: "2026-09-02T08:00:00.000Z",
  },
  {
    id: "tch-seed-04",
    fullName: "أ. هدى بنت سليمان المنصور",
    nationalId: "1076543210",
    mobileNumber: "0567788990",
    email: "huda.mansoor@school.edu.sa",
    jobTitle: "معلمة",
    employmentType: "متعاقد",
    teachingField: "التعليم العام",
    specialization: "العلوم",
    isArchived: false,
    archivedAt: null,
    archiveReason: null,
    createdAt: "2026-09-03T08:00:00.000Z",
    updatedAt: "2026-09-03T08:00:00.000Z",
  },
  {
    id: "tch-seed-05",
    fullName: "أ. سارة بنت عبدالعزيز التميمي",
    nationalId: "1065432109",
    mobileNumber: "0533344556",
    email: "sarah.tamimi@school.edu.sa",
    jobTitle: "معلمة",
    employmentType: "رسمي (معين)",
    teachingField: "التعليم العام",
    specialization: "اللغة الإنجليزية",
    isArchived: true,
    archivedAt: "2026-09-20T10:00:00.000Z",
    archiveReason: "نقل إلى المدرسة الابتدائية الخامسة عشر",
    createdAt: "2026-08-25T08:00:00.000Z",
    updatedAt: "2026-09-20T10:00:00.000Z",
  },
];

function rowToDomain(row: any): Teacher {
  return {
    id: row.id,
    fullName: row.full_name,
    nationalId: row.national_id,
    mobileNumber: row.mobile_number || row.phone_number || "",
    email: row.email || null,
    jobTitle: row.job_title || "معلمة",
    employmentType: row.employment_type || "رسمي",
    teachingField: row.teaching_field || "التعليم العام",
    specialization: row.specialization || "عام",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isArchived: !!row.is_archived,
    archivedAt: row.archived_at || null,
    archiveReason: row.archive_reason || null,
  };
}

const isMockEnvironment =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "test" ||
   !process.env.NEXT_PUBLIC_SUPABASE_URL ||
   process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"));

export class TeachersRepository implements ITeachersRepository {
  private localStore: Teacher[] = [...INITIAL_TEACHERS_SEED];

  async getAll(filter?: TeacherFilterOptions): Promise<Teacher[]> {
    if (isMockEnvironment) {
      return this.filterLocal(filter);
    }

    try {
      let query = supabaseClient.from("teachers").select("*");

      if (filter?.isArchived !== undefined) {
        query = query.eq("is_archived", filter.isArchived);
      }

      if (filter?.specialization) {
        query = query.eq("specialization", filter.specialization);
      }

      if (filter?.employmentType) {
        query = query.eq("employment_type", filter.employmentType);
      }

      const { data, error } = await query.order("full_name", { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to local memory filter
        return this.filterLocal(filter);
      }

      let results = data.map(rowToDomain);

      if (filter?.search) {
        const normSearch = normalizeArabicText(filter.search.toLowerCase());
        results = results.filter((t) => {
          const normName = normalizeArabicText(t.fullName.toLowerCase());
          return (
            normName.includes(normSearch) ||
            t.nationalId.includes(filter.search!) ||
            t.mobileNumber.includes(filter.search!) ||
            normalizeArabicText(t.specialization.toLowerCase()).includes(normSearch)
          );
        });
      }

      return results;
    } catch {
      return this.filterLocal(filter);
    }
  }

  private filterLocal(filter?: TeacherFilterOptions): Teacher[] {
    let result = [...this.localStore];

    if (filter?.isArchived !== undefined) {
      result = result.filter((t) => t.isArchived === filter.isArchived);
    }

    if (filter?.specialization) {
      result = result.filter((t) => t.specialization === filter.specialization);
    }

    if (filter?.employmentType) {
      result = result.filter((t) => t.employmentType === filter.employmentType);
    }

    if (filter?.search) {
      const normSearch = normalizeArabicText(filter.search.toLowerCase());
      result = result.filter((t) => {
        const normName = normalizeArabicText(t.fullName.toLowerCase());
        return (
          normName.includes(normSearch) ||
          t.nationalId.includes(filter.search!) ||
          t.mobileNumber.includes(filter.search!) ||
          normalizeArabicText(t.specialization.toLowerCase()).includes(normSearch)
        );
      });
    }

    return result.sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
  }

  async getById(id: string): Promise<Teacher | null> {
    if (isMockEnvironment) {
      return this.localStore.find((t) => t.id === id) || null;
    }

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        const local = this.localStore.find((t) => t.id === id);
        return local || null;
      }
      return rowToDomain(data);
    } catch {
      const local = this.localStore.find((t) => t.id === id);
      return local || null;
    }
  }

  async getByNationalId(nationalId: string): Promise<Teacher | null> {
    if (isMockEnvironment) {
      return this.localStore.find((t) => t.nationalId === nationalId) || null;
    }

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .select("*")
        .eq("national_id", nationalId)
        .maybeSingle();

      if (error || !data) {
        const local = this.localStore.find((t) => t.nationalId === nationalId);
        return local || null;
      }
      return rowToDomain(data);
    } catch {
      const local = this.localStore.find((t) => t.nationalId === nationalId);
      return local || null;
    }
  }

  async create(payload: TeacherInsertInput): Promise<Teacher> {
    const normalizedMobile = normalizeSaudiMobile(payload.mobileNumber) || payload.mobileNumber;
    const normalizedName = normalizeArabicText(payload.fullName);

    if (isMockEnvironment) {
      const newTeacher: Teacher = {
        id: `tch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...payload,
        mobileNumber: normalizedMobile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        archivedAt: null,
        archiveReason: null,
      };
      this.localStore.unshift(newTeacher);
      return newTeacher;
    }

    const dbInsert = {
      full_name: payload.fullName,
      normalized_name: normalizedName,
      national_id: payload.nationalId,
      mobile_number: normalizedMobile,
      phone_number: normalizedMobile,
      email: payload.email || null,
      job_title: payload.jobTitle || "معلمة",
      employment_type: payload.employmentType || "رسمي",
      teaching_field: payload.teachingField || "التعليم العام",
      specialization: payload.specialization || "عام",
      is_archived: false,
    };

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .insert(dbInsert)
        .select()
        .single();

      if (error || !data) {
        const newTeacher: Teacher = {
          id: `tch-${Date.now()}`,
          ...payload,
          mobileNumber: normalizedMobile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false,
          archivedAt: null,
          archiveReason: null,
        };
        this.localStore.unshift(newTeacher);
        return newTeacher;
      }
      return rowToDomain(data);
    } catch {
      const newTeacher: Teacher = {
        id: `tch-${Date.now()}`,
        ...payload,
        mobileNumber: normalizedMobile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        archivedAt: null,
        archiveReason: null,
      };
      this.localStore.unshift(newTeacher);
      return newTeacher;
    }
  }

  async update(id: string, payload: TeacherUpdateInput): Promise<Teacher> {
    if (isMockEnvironment) {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      this.localStore[index] = updated;
      return updated;
    }

    const updateObj: Database["public"]["Tables"]["teachers"]["Update"] = {
      updated_at: new Date().toISOString(),
    };

    if (payload.fullName) {
      updateObj.full_name = payload.fullName;
      updateObj.normalized_name = normalizeArabicText(payload.fullName);
    }
    if (payload.nationalId) updateObj.national_id = payload.nationalId;
    if (payload.mobileNumber) {
      const normMob = normalizeSaudiMobile(payload.mobileNumber) || payload.mobileNumber;
      updateObj.mobile_number = normMob;
      updateObj.phone_number = normMob;
    }
    if (payload.email !== undefined) updateObj.email = payload.email;
    if (payload.jobTitle) updateObj.job_title = payload.jobTitle;
    if (payload.employmentType) updateObj.employment_type = payload.employmentType;
    if (payload.teachingField) updateObj.teaching_field = payload.teachingField;
    if (payload.specialization) updateObj.specialization = payload.specialization;

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .update(updateObj)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        const index = this.localStore.findIndex((t) => t.id === id);
        if (index === -1) throw new Error("المعلمة غير موجودة");
        const updated: Teacher = {
          ...this.localStore[index],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        this.localStore[index] = updated;
        return updated;
      }
      return rowToDomain(data);
    } catch {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      this.localStore[index] = updated;
      return updated;
    }
  }

  async archive(id: string, reason: string): Promise<Teacher> {
    const now = new Date().toISOString();
    if (isMockEnvironment) {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        isArchived: true,
        archivedAt: now,
        archiveReason: reason,
        updatedAt: now,
      };
      this.localStore[index] = updated;
      return updated;
    }

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .update({
          is_archived: true,
          archived_at: now,
          archive_reason: reason,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        const index = this.localStore.findIndex((t) => t.id === id);
        if (index === -1) throw new Error("المعلمة غير موجودة");
        const updated: Teacher = {
          ...this.localStore[index],
          isArchived: true,
          archivedAt: now,
          archiveReason: reason,
          updatedAt: now,
        };
        this.localStore[index] = updated;
        return updated;
      }
      return rowToDomain(data);
    } catch {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        isArchived: true,
        archivedAt: now,
        archiveReason: reason,
        updatedAt: now,
      };
      this.localStore[index] = updated;
      return updated;
    }
  }

  async restore(id: string): Promise<Teacher> {
    const now = new Date().toISOString();
    if (isMockEnvironment) {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        isArchived: false,
        archivedAt: null,
        archiveReason: null,
        updatedAt: now,
      };
      this.localStore[index] = updated;
      return updated;
    }

    try {
      const { data, error } = await supabaseClient
        .from("teachers")
        .update({
          is_archived: false,
          archived_at: null,
          archive_reason: null,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        const index = this.localStore.findIndex((t) => t.id === id);
        if (index === -1) throw new Error("المعلمة غير موجودة");
        const updated: Teacher = {
          ...this.localStore[index],
          isArchived: false,
          archivedAt: null,
          archiveReason: null,
          updatedAt: now,
        };
        this.localStore[index] = updated;
        return updated;
      }
      return rowToDomain(data);
    } catch {
      const index = this.localStore.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("المعلمة غير موجودة");
      const updated: Teacher = {
        ...this.localStore[index],
        isArchived: false,
        archivedAt: null,
        archiveReason: null,
        updatedAt: now,
      };
      this.localStore[index] = updated;
      return updated;
    }
  }

  async delete(id: string): Promise<void> {
    if (isMockEnvironment) {
      this.localStore = this.localStore.filter((t) => t.id !== id);
      return;
    }
    await supabaseClient.from("teachers").delete().eq("id", id);
    this.localStore = this.localStore.filter((t) => t.id !== id);
  }
}

export const teachersRepository = new TeachersRepository();
