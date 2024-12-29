import { CourseMetricControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { courseKeys } from "../../keys";

export const useCourseMetrics = (courseId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.metrics(courseId),
    queryFn: async () => {
      const controller = new CourseMetricControllerApi();
      const response = await controller.getMetrics(courseId);
      return response.data;
    },
  });

  return { courseMetrics: data, isLoading };
};
