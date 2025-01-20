import { PodStatelessDetailsDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

interface UseStatelessPodsForCourseOptions {
  queryKey?: unknown[];
}

export const useStatelessPodsForCourse = (
  courseId: string,
  options: UseStatelessPodsForCourseOptions = {}
) => {
  const { data, isLoading } = useQuery({
    queryKey: options.queryKey ?? [keys.STATELESS_POD, 'course', courseId],
    queryFn: async () => {
      const response = await privateAxios.get<PodStatelessDetailsDto[]>(
        `/pods/stateless/course/${courseId}`
      );
      return response.data;
    },
  });

  return { statelessPods: data, isLoading };
};