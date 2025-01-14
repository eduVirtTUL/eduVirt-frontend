import { NetworkVmConnectionDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

type Data = {
  networkId: string;
  etag: string;
} & NetworkVmConnectionDto;

export const useAttachNicToNetwork = () => {
  const { t } = useTranslation();
  const { id } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ networkId, etag, ...original }: Data) => {
      await privateAxios.post(`/network/${networkId}/attach`, original, {
        headers: { "If-Match": etag },
      });
    },
    onSuccess: (_, variables) => {
      toast.success(t("resourceGroupEditor.attachNetwork.success"));
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(id ?? "", variables.vmId ?? ""),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("resourceGroupEditor.attachNetwork.error"));
    },
  });

  return {
    attachNicToNetwork: mutate,
    attachNicToNetworkAsync: mutateAsync,
    isPending,
  };
};
