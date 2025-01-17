import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

export const useRemoveClusterMetricValue = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "removeClusterMetricValue" ],
    mutationFn: async (metricId: string) => {
      const response = await privateAxios.delete<void>(
        `/cluster/${id}/metric/${metricId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES, id]});
      toast.success(t("clusterMetricValues.removeClusterMetricValue.success"));
    }
  });

  return {
    removeClusterMetricValue: mutate,
    removeClusterMetricValueAsync: mutateAsync,
  };
};
