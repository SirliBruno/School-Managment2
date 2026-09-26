import { useQuery } from "@tanstack/react-query";
import { absenceRecordsRepository } from "@/repositories/absenceRecordsRepository";
import type { AbsenceRecord } from "@/types/database";

export const absenceRecordsQueryKeys = {
  all: ["absence-records"] as const,
  byTeacher: (teacherId: string) => ["absence-records", "teacher", teacherId] as const,
  detail: (id: string) => ["absence-records", id] as const,
};

export function useAbsenceRecords() {
  return useQuery<AbsenceRecord[], Error>({
    queryKey: absenceRecordsQueryKeys.all,
    queryFn: () => absenceRecordsRepository.getAll(),
  });
}

export function useTeacherAbsenceRecords(teacherId: string) {
  return useQuery<AbsenceRecord[], Error>({
    queryKey: absenceRecordsQueryKeys.byTeacher(teacherId),
    queryFn: () => absenceRecordsRepository.getByTeacherId(teacherId),
    enabled: Boolean(teacherId),
  });
}
