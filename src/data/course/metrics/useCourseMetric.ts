import { MetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { useQuery } from "@tanstack/react-query";

export const useCourseMetric = (courseId: string, metricId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.metric(courseId, metricId),
    queryFn: async () => {
      const response = await privateAxios.get<MetricValueDto>(
        `/course/${courseId}/metric/${metricId}`
      );
      return response.data;
    },
  });

  return { courseMetric: data, isLoading };
};
