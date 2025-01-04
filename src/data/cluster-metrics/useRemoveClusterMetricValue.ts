import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClusterMetricControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import {useTranslation} from "react-i18next";

export const useRemoveClusterMetricValue = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {mutate, mutateAsync} = useMutation({
    mutationKey: ["removeClusterMetricValue"],
    mutationFn: async (metricId: string) => {
      const controller = new ClusterMetricControllerApi();
      const response = await controller.deleteMetric1(id, metricId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES, id]});
      toast.success(t("clusterMetricValues.removeClusterMetricValue.success"));
    },
    onError: () => {
      toast.error(t("clusterMetricValues.removeClusterMetricValue.error"));
    },
  });

  return {
    removeClusterMetricValue: mutate,
    removeClusterMetricValueAsync: mutateAsync,
  };
};
