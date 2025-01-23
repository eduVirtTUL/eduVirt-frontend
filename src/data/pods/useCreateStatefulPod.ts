import { CreatePodStatefulDto, PodStatefulDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useCreateStatefulPod = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createStatefulPod"],
    mutationFn: async (pod: CreatePodStatefulDto) => {
      const response = await privateAxios.post<PodStatefulDto>(
        `/pods/stateful`, pod
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.POD] });
      queryClient.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP, 'withPods'] })
      toast.success(t("statefulPodManagement.success"));
    },
  });

  return { createStatefulPod: mutate, createStatefulPodAsync: mutateAsync };
}