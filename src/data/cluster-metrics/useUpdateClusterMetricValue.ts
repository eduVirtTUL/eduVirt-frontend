import {useTranslation} from "react-i18next";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ClusterMetricControllerApi, ValueDto} from "@/api";
import {keys} from "@/data/keys";
import {toast} from "sonner";

export const useUpdateClusterMetricValue = (clusterId: string, metricId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["updateClusterMetricValue"],
    mutationFn: async (updateDto: ValueDto) => {
      const controller = new ClusterMetricControllerApi();
      const response = await controller.updateMetricValue(clusterId, metricId, updateDto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES]});
      toast.success(t("clusterMetricValues.updateClusterMetricValue.success"));
    },
    onError: () => {
      toast.error(t("clusterMetricValues.updateClusterMetricValue.error"));
    }
  });

  return {
    updateClusterMetricValue: mutate,
    updateClusterMetricValueAsync: mutateAsync,
  }
};