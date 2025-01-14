import {
  CreateResourceGroupNetworkDto,
  ResourceGroupNetworkControllerApi,
} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { injectToken } from "@/utils/requestUtils";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useTranslation } from "react-i18next";

type AddResourceGroupNetworkPayload = {
  id: string;
} & CreateResourceGroupNetworkDto;

export const useAddResourceGroupNetwork = () => {
  const { t } = useTranslation();
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
      toast.success(t("resourceGroupEditor.addNetwork.success"));
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.detail(payload.id),
      });
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(payload.id),
      });
    },
    onError: () => {
      toast.error(t("resourceGroupEditor.addNetwork.error"));
    },
  });

  return {
    addNetwork: mutate,
    addNetworkAsync: mutateAsync,
  };
};
