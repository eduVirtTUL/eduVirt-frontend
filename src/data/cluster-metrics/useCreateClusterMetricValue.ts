import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClusterMetricControllerApi, CreateMetricValueDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import {useTranslation} from "react-i18next";

export const useCreateClusterMetricValue = (id: string) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["createClusterMetricValue"],
        mutationFn: async (createDto: CreateMetricValueDto) => {
            const controller = new ClusterMetricControllerApi();
            const response = await controller.createMetricValue(id, createDto);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES, id]});
            toast.success(t("clusterMetricValues.createClusterMetricValue.success"));
        },
        onError: () => {
            toast.error(t("clusterMetricValues.createClusterMetricValue.error"));
        },
    });

  return {
    createClusterMetricValue: mutate,
    createClusterMetricValueAsync: mutateAsync,
  };
};
