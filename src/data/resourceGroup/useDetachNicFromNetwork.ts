import { NetworkVmConnectionDto, PrivateNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken } from "@/utils/requestUtils";
import { useTranslation } from "react-i18next";

type NetworkVmConnection = {
  etag: string;
} & NetworkVmConnectionDto;

export const useDetachNicFromNetwork = () => {
  const { t } = useTranslation();
  const { id } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ etag, ...data }: NetworkVmConnection) => {
      const controller = new PrivateNetworkControllerApi();
      const response = await controller.detachNicFromNetwork(etag, data, {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(t("resourceGroupEditor.detachNetwork.success"));
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(id ?? "", variables.vmId ?? ""),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("resourceGroupEditor.detachNetwork.error"));
    },
  });

  return {
    detachNicFromNetwork: mutate,
    detachNicFromNetworkAsync: mutateAsync,
  };
};
