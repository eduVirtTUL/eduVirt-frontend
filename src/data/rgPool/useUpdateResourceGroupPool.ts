import {
  ResourceGroupPoolControllerApi,
  UpdateResourceGroupPoolDto,
} from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceGroupPoolKeys } from "../keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UpdateResourceGroupPool = {
  id: string;
  etag: string;
} & UpdateResourceGroupPoolDto;

export const useUpdateResourceGroupPool = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateResourceGroupPool) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.updateResourceGroupPool(id, org, {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupPoolKeys.detail(id),
      });
      toast.success(t("editResourceGroupPoolModal.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("editResourceGroupPoolModal.error"));
    },
  });

  return {
    updateResourceGroupPool: mutate,
    updateResourceGroupPoolAsync: mutateAsync,
    isUpdating: isPending,
  };
};
