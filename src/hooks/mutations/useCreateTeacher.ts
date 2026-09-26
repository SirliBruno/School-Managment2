import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teachersRepository } from "@/repositories/teachersRepository";
import { teachersQueryKeys } from "@/hooks/queries/useTeachers";
import type { Teacher, Database } from "@/types/database";

type TeacherInsert = Database["public"]["Tables"]["teachers"]["Insert"];

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation<Teacher, Error, TeacherInsert>({
    mutationFn: (payload: TeacherInsert) => teachersRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
    },
  });
}
