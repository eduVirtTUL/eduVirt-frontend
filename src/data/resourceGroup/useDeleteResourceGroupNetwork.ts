import { PrivateNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { injectToken } from "@/utils/requestUtils";

export const useDeleteResourceGroupNetwork = () => {
  const { t } = useTranslation();
  const { id: rgId } = useParams();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new PrivateNetworkControllerApi();
      await controller.deleteNetwork(id, { ...injectToken() });
    },
    onSuccess: () => {
      toast.success(t("resourceGroupEditor.privateSegments.deleteSuccess"));
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(rgId!),
      });
    },
    onError: () => {
      toast.error(t("resourceGroupEditor.privateSegments.deleteError"));
    },
  });

  return { deleteNetwork: mutate, deleteNetworkAsync: mutateAsync };
};
