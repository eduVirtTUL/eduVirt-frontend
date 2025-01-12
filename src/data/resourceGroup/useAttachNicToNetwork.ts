import { NetworkVmConnectionDto, PrivateNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken } from "@/utils/requestUtils";

type Data = {
  networkId: string;
} & NetworkVmConnectionDto;

export const useAttachNicToNetwork = () => {
  const { id } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ networkId, ...original }: Data) => {
      const controller = new PrivateNetworkControllerApi();
      const response = await controller.attachNicToNetwork(
        networkId,
        original,
        { ...injectToken() }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("VM attached to network");
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(id ?? "", variables.vmId ?? ""),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    attachNicToNetwork: mutate,
    attachNicToNetworkAsync: mutateAsync,
    isPending,
  };
};
