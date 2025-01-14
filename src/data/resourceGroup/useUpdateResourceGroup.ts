import { ResourceGroupControllerApi, UpdateResourceGroupDto } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type UpdateResourceGroup = {
  id: string;
  etag: string;
} & UpdateResourceGroupDto;

export const useUpdateResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateResourceGroup) => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.updateResourceGroup(id, etag, org, {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id] });
      toast.success(t("resourceGroupEditor.updateResourceGroup.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("resourceGroupEditor.updateResourceGroup.error"));
    },
  });

  return {
    updateResourceGroup: mutate,
    updateResourceGroupAsync: mutateAsync,
    isUpdating: isPending,
  };
};
