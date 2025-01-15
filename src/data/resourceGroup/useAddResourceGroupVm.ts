import { AddVmDto } from "./../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { resourceGroupKeys } from "../keys";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";
import { useDialog } from "@/stores/dialogStore";

export const useAddResourceGroupVm = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { close } = useDialog();
  const { etag } = useResourceGroupEditorStore();
  const { mutate } = useMutation({
    mutationFn: async (data: AddVmDto) => {
      await privateAxios.post(`/resource-group/${id}/vm`, data, {
        headers: {
          "If-Match": etag,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceGroupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id, "vm"] });
      queryClient.invalidateQueries({ queryKey: ["vm"] });
      toast.success(t("resourceGroupEditor.addVm.success"));
    },
    onError: () => {
      close();
    },
  });

  return { addVm: mutate };
};
