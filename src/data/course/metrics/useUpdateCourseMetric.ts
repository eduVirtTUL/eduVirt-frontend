import { CourseMetricControllerApi, UpdateMetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateCourseMetric = {
  courseId: string;
  metricId: string;
} & Required<UpdateMetricValueDto>;

export const useUpdateCourseMetric = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      courseId,
      metricId,
      ...original
    }: UpdateCourseMetric) => {
      const controller = new CourseMetricControllerApi();
      const response = await controller.updateMetric(
        courseId,
        metricId,
        original
      );
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(courseId),
      });
      toast.success("Metric updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update metric");
    },
  });

  return {
    updateCourseMetric: mutate,
    updateCourseMetricAsync: mutateAsync,
    isPending,
  };
};
