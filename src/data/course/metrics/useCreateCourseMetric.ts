import { CreateMetricValueDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type CreateCourseMetric = {
  courseId: string;
} & Required<CreateMetricValueDto>;

export const useCreateCourseMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ courseId, ...original }: CreateCourseMetric) => {
      await privateAxios.post(`/course/${courseId}/metric`, original);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.metrics(variables.courseId),
      });
      toast.success(t("courseLimits.createCourseMetricValue.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("courseLimits.createCourseMetricValue.error"));
    },
  });

  return {
    createCourseMetric: mutate,
    createCourseMetricAsync: mutateAsync,
    isPending,
  };
};
