import { CourseMetricControllerApi } from "@/api";
import { courseKeys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteCourseMetric = {
  courseId: string;
  metricId: string;
};

export const useDeleteCourseMetric = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ courseId, metricId }: DeleteCourseMetric) => {
      const controller = new CourseMetricControllerApi();
      const respone = await controller.deleteMetric(courseId, metricId);
      return respone.data;
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(data.courseId),
      });
      toast.success("Metric deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete metric");
    },
  });

  return {
    deleteCourseMetric: mutate,
    deleteCourseMetricAsync: mutateAsync,
    isPending,
  };
};
