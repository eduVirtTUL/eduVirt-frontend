import { CreatePodStatelessDto, PodStatelessDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useCreateStatelessPodsBatch = () => {
  const queryClient = useQueryClient();
  
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createStatelessPodsBatch"],
    mutationFn: async (pods: CreatePodStatelessDto[]) => {
      const response = await privateAxios.post<PodStatelessDto[]>(
        `/pods/stateless/batch`, 
        pods
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.STATELESS_POD] });
      toast.success(t("podManagement.createSuccess"));
    },
  });

  return { createStatelessPodsBatch: mutate, createStatelessPodsBatchAsync: mutateAsync };
};