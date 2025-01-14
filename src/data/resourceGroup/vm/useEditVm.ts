import { EditVmDto } from "@/api";
import { resourceGroupKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type EditVmInput = {
  id: string;
  etag: string;
} & EditVmDto;

export const useEditVm = () => {
  const { t } = useTranslation();
  const { id: rgId } = useResourceGroupEditorStore();
  const client = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: EditVmInput) => {
      await privateAxios.put(`/resource-group/${rgId}/vm/${id}`, org, {
        headers: {
          "If-Match": etag,
        },
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: resourceGroupKeys.detail(rgId!) });
      toast.success(t("editVmModal.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("editVmModal.error"));
    },
  });

  return { editVm: mutate, editVmAsync: mutateAsync, isPending };
};
