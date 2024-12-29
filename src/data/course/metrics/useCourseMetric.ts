import { CourseMetricControllerApi } from "@/api";
import { courseKeys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";

export const useCourseMetric = (courseId: string, metricId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.metric(courseId, metricId),
    queryFn: async () => {
      const controller = new CourseMetricControllerApi();
      const response = await controller.getMetric(courseId, metricId);
      return response.data;
    },
  });

  return { courseMetric: data, isLoading };
};
