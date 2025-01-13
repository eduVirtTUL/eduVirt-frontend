import { CreateRGPoolDto, ResourceGroupPoolControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { useTranslation } from "react-i18next";
import { injectToken } from "@/utils/requestUtils";

export const useCreatePool = () => {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createPool"],
    mutationFn: async (pool: CreateRGPoolDto) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.createResourceGroupPool(pool, {
        ...injectToken(),
      });
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
