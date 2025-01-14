import { CreateRGPoolDto, ResourceGroupPoolDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

export const useCreatePool = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (pool: CreateRGPoolDto) => {
      const response = await privateAxios.post<ResourceGroupPoolDto>(
        `/resource-group-pool`,
        pool
      );

      return response.data;
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("createResourceGroupPoolModal.error"));
    },
    onSuccess: () => {
      toast.success(t("createResourceGroupPoolModal.success"));
      client.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP] });
    },
  });

  return { createPool: mutate, createPoolAsync: mutateAsync };
};
