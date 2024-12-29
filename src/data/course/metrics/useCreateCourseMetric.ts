import { CourseMetricControllerApi, CreateMetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateCourseMetric = {
  courseId: string;
} & Required<CreateMetricValueDto>;

export const useCreateCourseMetric = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ courseId, ...original }: CreateCourseMetric) => {
      const controller = new CourseMetricControllerApi();
      const response = await controller.createMetric(courseId, original);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(variables.courseId),
      });
      toast.success("Metric created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create metric");
    },
  });

  return {
    createCourseMetric: mutate,
    createCourseMetricAsync: mutateAsync,
    isPending,
  };
};
