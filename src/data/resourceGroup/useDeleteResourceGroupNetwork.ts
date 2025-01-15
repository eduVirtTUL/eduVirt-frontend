import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useTranslation } from "react-i18next";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { privateAxios } from "../privateAxios";

export const useDeleteResourceGroupNetwork = () => {
  const { t } = useTranslation();
  const { id: rgId, etag } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.delete(`/resource-group/${rgId}/network/${id}`, {
        headers: {
          "If-Match": etag,
        },
      });
    },
    onSuccess: () => {
      toast.success(t("resourceGroupEditor.privateSegments.deleteSuccess"));
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.detail(rgId!),
      });
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(rgId!),
      });
    },
  });

  return { deleteNetwork: mutate, deleteNetworkAsync: mutateAsync };
};
