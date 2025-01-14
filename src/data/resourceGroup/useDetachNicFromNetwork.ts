import { NetworkVmConnectionDto, PrivateNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken } from "@/utils/requestUtils";

type NetworkVmConnection = {
  etag: string;
} & NetworkVmConnectionDto;

export const useDetachNicFromNetwork = () => {
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
      toast.success("VM detached from network");
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(id ?? "", variables.vmId ?? ""),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    detachNicFromNetwork: mutate,
    detachNicFromNetworkAsync: mutateAsync,
  };
};
