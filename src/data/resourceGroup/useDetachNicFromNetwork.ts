import { NetworkVmConnectionDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

type NetworkVmConnection = {
  etag: string;
} & NetworkVmConnectionDto;

export const useDetachNicFromNetwork = () => {
  const { t } = useTranslation();
  const { id } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ etag, ...data }: NetworkVmConnection) => {
      await privateAxios.post("/network/detach", data, {
        headers: {
          "If-Match": etag,
        },
      });
    },
    onSuccess: (_, variables) => {
      toast.success(t("resourceGroupEditor.detachNetwork.success"));
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(id ?? "", variables.vmId ?? ""),
      });
    },
  });

  return {
    detachNicFromNetwork: mutate,
    detachNicFromNetworkAsync: mutateAsync,
  };
};
