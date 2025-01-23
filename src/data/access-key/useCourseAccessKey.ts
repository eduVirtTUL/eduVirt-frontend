import { CourseAccessKeyDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

interface UseCourseAccessKeyOptions {
  enabled?: boolean
}

export const useCourseAccessKey = (id: string, options: UseCourseAccessKeyOptions = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.ACCESS_KEY, id],
    queryFn: async () => {
      const response = await privateAxios.get<CourseAccessKeyDto>(
        `/access-keys/course/${id}`
      );
      return response.data;
    },
    retry: false,
    enabled: options.enabled,
  });

  return { course: data, isLoading };
}