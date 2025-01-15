import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
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
      await privateAxios.delete(`/course/${courseId}/metric/${metricId}`);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(data.courseId),
      });

      toast.success(t("courseLimits.deleteCourseMetric.success"));
    },
  });

  return {
    deleteCourseMetric: mutate,
    deleteCourseMetricAsync: mutateAsync,
    isPending,
  };
};
