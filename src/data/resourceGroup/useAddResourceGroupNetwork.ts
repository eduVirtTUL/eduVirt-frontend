import {
  CreateResourceGroupNetworkDto,
  ResourceGroupNetworkControllerApi,
} from "@/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddResourceGroupNetwork = (id: string) => {
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (data: CreateResourceGroupNetworkDto) => {
      const controller = new ResourceGroupNetworkControllerApi();
      const respone = await controller.addResourceGroupNetwork(data, id);
      return respone.data;
    },
    onSuccess: () => {
      toast.success("Network added");
    },
    onError: () => {
      toast.error("Failed to add network");
    },
  });

  return {
    addNetwork: mutate,
    addNetworkAsync: mutateAsync,
  };
};
