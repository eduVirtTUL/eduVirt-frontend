import {
  CreateResourceGroupNetworkDto,
  ResourceGroupNetworkControllerApi,
} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

type AddResourceGroupNetworkPayload = {
  id: string;
} & CreateResourceGroupNetworkDto;

export const useAddResourceGroupNetwork = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ id, name }: AddResourceGroupNetworkPayload) => {
      const controller = new ResourceGroupNetworkControllerApi();
      const respone = await controller.addResourceGroupNetwork({ name }, id, {
        ...injectToken(),
      });
      return respone.data;
    },
    onSuccess: (_, payload) => {
      toast.success("Network added");
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(payload.id),
      });
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
