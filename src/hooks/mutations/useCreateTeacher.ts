import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teachersRepository } from "@/repositories/teachersRepository";
import { teachersQueryKeys } from "@/hooks/queries/useTeachers";
import type { Teacher, TeacherInsertInput } from "@/types/teacher";

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation<Teacher, Error, TeacherInsertInput>({
    mutationFn: (payload: TeacherInsertInput) => teachersRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
    },
  });
}
