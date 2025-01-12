import { CourseMetricControllerApi } from "@/api";
import { courseKeys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type DeleteCourseMetric = {
  courseId: string;
  metricId: string;
};

export const useDeleteCourseMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ courseId, metricId }: DeleteCourseMetric) => {
      const controller = new CourseMetricControllerApi();
      const respone = await controller.deleteMetric(courseId, metricId, {
        ...injectToken(),
      });
      return respone.data;
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(data.courseId),
      });

      toast.success(t("courseLimits.deleteCourseMetric.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("courseLimits.deleteCourseMetric.error"));
    },
  });

  return {
    deleteCourseMetric: mutate,
    deleteCourseMetricAsync: mutateAsync,
    isPending,
  };
};
