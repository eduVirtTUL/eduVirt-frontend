import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricValueDto, ValueDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";

type UpdateClusterMetricValue = {
  clusterId: string;
  metricId: string;
  etag: string;
} & ValueDto;

export const useUpdateClusterMetricValue = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    meta: { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } },
    mutationKey: [ "updateClusterMetricValue" ],
    mutationFn: async ({ clusterId, metricId, etag, ...updateDto }: UpdateClusterMetricValue) => {
      const response = await privateAxios.patch<MetricValueDto>(
        `/clusters/${clusterId}/metrics/${metricId}`, updateDto, {
          headers: {
            "If-Match": etag
          }
        });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES]});
      toast.success(t("clusterMetricValues.updateClusterMetricValue.success"));
    }
  });

  return {
    updateClusterMetricValue: mutate,
    updateClusterMetricValueAsync: mutateAsync,
  }
};