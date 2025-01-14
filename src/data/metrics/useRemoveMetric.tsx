import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { injectToken } from "@/utils/requestUtils";

export const useRemoveMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "removeMetric" ],
    mutationFn: async (metricId: string) => {
      const controller = new MetricControllerApi();
      const response = await controller.deleteMetric2(
        metricId, { ...injectToken() }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.METRICS]});
      toast.success(t("metrics.removeMetric.success"));
    },
    onError: () => {
      toast.error(t("metrics.removeMetric.error"));
    },
  });

  return {
    removeMetric: mutate,
    removeMetricAsync: mutateAsync,
  };
};