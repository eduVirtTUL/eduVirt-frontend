import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMetricValueDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

export const useCreateClusterMetricValue = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "createClusterMetricValue" ],
    mutationFn: async (createDto: CreateMetricValueDto) => {
      const response = await privateAxios.post(
        `/clusters/${id}/metrics`, createDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES, id]});
      toast.success(t("clusterMetricValues.createClusterMetricValue.success"));
    }
  });

  return {
    createClusterMetricValue: mutate,
    createClusterMetricValueAsync: mutateAsync,
  };
};
