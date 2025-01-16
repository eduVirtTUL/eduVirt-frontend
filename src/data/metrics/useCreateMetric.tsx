import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMetricDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";

export const useCreateMetric = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {mutate, mutateAsync} = useMutation({
    mutationKey: ["createMetric"],
    mutationFn: async (createDto: CreateMetricDto) => {
      const response = await privateAxios.post<void>(
        `/metrics`, createDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.METRICS]});
      toast.success(t("metrics.createMetric.success"));
    }
  });

  return {
    createMetric: mutate,
    createMetricAsync: mutateAsync,
  };
};