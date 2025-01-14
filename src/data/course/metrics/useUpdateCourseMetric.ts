import { UpdateMetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
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
      await privateAxios.put(
        `/course/${courseId}/metric/${metricId}`,
        original
      );
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
