import { injectToken } from "@/utils/requestUtils";
import { CreateResourceGroupDto, ResourceGroupPoolControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupPoolKeys } from "../keys";
import { useTranslation } from "react-i18next";

type CreateStatelessResourceGroup = {
  id: string;
} & CreateResourceGroupDto;

export const useCreateStatelessResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: CreateStatelessResourceGroup) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.addResourceGroupToPool(id, org, {
        ...injectToken(),
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupPoolKeys.detail(id),
      });
      toast.success(t("createResourceGroupModal.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("createResourceGroupModal.error"));
    },
  });

  return {
    createStatelessResourceGroup: mutate,
    createStatelessResourceGroupAsync: mutateAsync,
    isPending,
  };
};
