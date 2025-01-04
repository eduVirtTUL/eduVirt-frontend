import {useTranslation} from "react-i18next";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateMetricDto, MetricControllerApi} from "@/api";
import {keys} from "@/data/keys";
import {toast} from "sonner";

export const useCreateMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {mutate, mutateAsync} = useMutation({
    mutationKey: ["createMetric"],
    mutationFn: async (createDto: CreateMetricDto) => {
      const controller = new MetricControllerApi();
      const response = await controller.createNewMetric(createDto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.METRICS]});
      toast.success(t("metrics.createMetric.success"));
    },
    onError: () => {
      toast.error(t("metrics.createMetric.error"));
    },
  });

  return {
    createMetric: mutate,
    createMetricAsync: mutateAsync,
  };
};