import { injectToken } from "./../../utils/requestUtils";
import { AddVmDto } from "./../../api/api";
import { ResourceGroupVmControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { resourceGroupKeys } from "../keys";
import { useTranslation } from "react-i18next";

export const useAddResourceGroupVm = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { etag } = useResourceGroupEditorStore();
  const { mutate } = useMutation({
    mutationFn: async (data: AddVmDto) => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.addVm(id, etag ?? "", data, {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the resourceGroupVms query to refetch the data
      queryClient.invalidateQueries({ queryKey: resourceGroupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id, "vm"] });
      queryClient.invalidateQueries({ queryKey: ["vm"] });
      toast.success(t("resourceGroupEditor.addVm.success"));
    },
    onError: () => {
      toast.error(t("resourceGroupEditor.addVm.error"));
    },
  });

  return { addVm: mutate };
};
