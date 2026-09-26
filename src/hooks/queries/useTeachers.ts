import { useQuery } from "@tanstack/react-query";
import { teachersRepository } from "@/repositories/teachersRepository";
import type { Teacher } from "@/types/database";

export const teachersQueryKeys = {
  all: ["teachers"] as const,
  detail: (id: string) => ["teachers", id] as const,
};

export function useTeachers() {
  return useQuery<Teacher[], Error>({
    queryKey: teachersQueryKeys.all,
    queryFn: () => teachersRepository.getAll(),
  });
}

export function useTeacher(id: string) {
  return useQuery<Teacher | null, Error>({
    queryKey: teachersQueryKeys.detail(id),
    queryFn: () => teachersRepository.getById(id),
    enabled: Boolean(id),
  });
}
