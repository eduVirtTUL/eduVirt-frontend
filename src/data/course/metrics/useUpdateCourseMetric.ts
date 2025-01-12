import { CourseMetricControllerApi, UpdateMetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type UpdateCourseMetric = {
  courseId: string;
  metricId: string;
} & Required<UpdateMetricValueDto>;

export const useUpdateCourseMetric = () => {
  const { t } = useTranslation();
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
        original,
        {
          ...injectToken(),
        }
      );
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(courseId),
      });
      toast.success(t("courseLimits.editCourseMetricValue.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("courseLimits.editCourseMetricValue.error"));
    },
  });

  return {
    updateCourseMetric: mutate,
    updateCourseMetricAsync: mutateAsync,
    isPending,
  };
};
