import { EditVmDto, ResourceGroupVmControllerApi } from "@/api";
import { resourceGroupKeys } from "@/data/keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type EditVmInput = {
  id: string;
} & EditVmDto;

export const useEditVm = () => {
  const { t } = useTranslation();
  const { id: rgId } = useResourceGroupEditorStore();
  const client = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: EditVmInput) => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.updateVm(rgId!, id, org, {
        ...injectToken(),
      });
      return response.data;
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
