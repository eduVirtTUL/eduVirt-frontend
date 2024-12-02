import { NetworkVmConnectionDto, PrivateNetworkControllerApi } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Data = {
  networkId: string;
} & NetworkVmConnectionDto;

export const useAttachVmToNetwork = () => {
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ networkId, vmId }: Data) => {
      const controller = new PrivateNetworkControllerApi();
      const response = await controller.attachVmToNetwork(networkId, { vmId });
      return response.data;
    },
    onSuccess: () => {
      toast.success("VM attached to network");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { attachVmToNetwork: mutate, attachVmToNetworkAsync: mutateAsync };
};
