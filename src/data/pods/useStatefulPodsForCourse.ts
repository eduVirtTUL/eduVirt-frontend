import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { PodStatefulDetailsDto } from "@/api";

interface UseStatefulPodsForCourseOptions {
  enabled?: boolean;
}

export const useStatefulPodsForCourse = (
  courseId: string,
  options: UseStatefulPodsForCourseOptions = {}
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [keys.POD, courseId, "stateful"],
    queryFn: async () => {
      const response = await privateAxios.get<PodStatefulDetailsDto[]>(
        `/pods/stateful/course/${courseId}`
      );
      return response.data;
    },
    enabled: options.enabled,
  });

  return {
    pods: data ?? [],
    isLoading,
    error,
  };
};