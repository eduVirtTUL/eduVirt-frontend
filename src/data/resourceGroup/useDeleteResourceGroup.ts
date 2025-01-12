import { ResourceGroupControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useDeleteResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.deleteResourceGroup(id, {
        ...injectToken(),
      });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id] });
      toast.success(t("resourceGroupEditor.deleteResourceGroup.success"));
    },
    onError: () => {
      console.log("error");
      toast.error(t("resourceGroupEditor.deleteResourceGroup.error"));
    },
  });

  return {
    deleteResourceGroup: mutate,
    deleteResourceGroupAsync: mutateAsync,
    isDeleting: isPending,
  };
};
