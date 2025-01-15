import { ResourceGroupVmControllerApi } from "@/api";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useTranslation } from "react-i18next";
import { injectToken } from "@/utils/requestUtils";
import { useDialog } from "@/stores/dialogStore";

export const useDeleteResourceGroupVm = () => {
  const { t } = useTranslation();
  const { id: rgId, etag } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { close } = useDialog();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.deleteVm(rgId!, id, etag ?? "", {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: (_, vmId) => {
      // Invalidate the resourceGroupVms query to refetch the data
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.detail(rgId!),
      });
      queryClient.invalidateQueries({ queryKey: ["vm"] });
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(rgId!, vmId),
      });
      toast.success(t("removeVmModal.success"));
    },
    onError: () => {
      close();
    },
  });

  return { deleteVm: mutate, deleteVmAsync: mutateAsync, isPending };
};
