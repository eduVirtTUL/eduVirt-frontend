import { ResourceGroupNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useTranslation } from "react-i18next";
import { injectToken } from "@/utils/requestUtils";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";

export const useDeleteResourceGroupNetwork = () => {
  const { t } = useTranslation();
  const { id: rgId, etag } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new ResourceGroupNetworkControllerApi();
      await controller.deleteNetwork(id, rgId!, etag ?? "", {
        headers: { "If-Match": etag, ...injectToken().headers },
      });
    },
    onSuccess: () => {
      toast.success(t("resourceGroupEditor.privateSegments.deleteSuccess"));
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.detail(rgId!),
      });
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(rgId!),
      });
    },
    onError: () => {
      toast.error(t("resourceGroupEditor.privateSegments.deleteError"));
    },
  });

  return { deleteNetwork: mutate, deleteNetworkAsync: mutateAsync };
};
