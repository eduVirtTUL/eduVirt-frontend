import { MetricValueDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { courseKeys } from "../../keys";
import { privateAxios } from "@/data/privateAxios";

export const useCourseMetrics = (courseId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.metrics(courseId),
    queryFn: async () => {
      const response = await privateAxios.get<MetricValueDto[]>(
        `/course/${courseId}/metric`
      );
      return response.data;
    },
  });

  return { courseMetrics: data, isLoading };
};
