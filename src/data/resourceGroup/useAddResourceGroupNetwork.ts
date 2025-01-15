import { CreateResourceGroupNetworkDto, ResourceGroupNetworkDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

type AddResourceGroupNetworkPayload = {
  id: string;
} & CreateResourceGroupNetworkDto;

export const useAddResourceGroupNetwork = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { etag } = useResourceGroupEditorStore();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ id, ...org }: AddResourceGroupNetworkPayload) => {
      const response = await privateAxios.post<ResourceGroupNetworkDto>(
        `/resource-group/${id}/network`,
        org,
        {
          headers: {
            "If-Match": etag,
          },
        }
      );
      return response.data;
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
  });

  return {
    addNetwork: mutate,
    addNetworkAsync: mutateAsync,
  };
};
