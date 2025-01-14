import {
  CreateResourceGroupNetworkDto,
  ResourceGroupNetworkControllerApi,
} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { injectToken } from "@/utils/requestUtils";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";

type AddResourceGroupNetworkPayload = {
  id: string;
} & CreateResourceGroupNetworkDto;

export const useAddResourceGroupNetwork = () => {
  const queryClient = useQueryClient();
  const { etag } = useResourceGroupEditorStore();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ id, ...org }: AddResourceGroupNetworkPayload) => {
      const controller = new ResourceGroupNetworkControllerApi();
      const respone = await controller.addResourceGroupNetwork(
        id,
        etag ?? "",
        org,
        {
          headers: {
            "If-Match": etag,
            ...injectToken().headers,
          },
        }
      );
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
