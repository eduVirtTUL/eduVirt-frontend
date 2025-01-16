import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";

export const useRemoveMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "removeMetric" ],
    mutationFn: async (metricId: string) => {
      const response = await privateAxios.delete<void>(
        `/metrics/${metricId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.METRICS]});
      toast.success(t("metrics.removeMetric.success"));
    }
  });

  return {
    removeMetric: mutate,
    removeMetricAsync: mutateAsync,
  };
};