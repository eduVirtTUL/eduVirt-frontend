import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { privateAxios } from "../privateAxios";
import { useDialog } from "@/stores/dialogStore";

export const useDeleteResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { close } = useDialog();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.delete(`/resource-group/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id] });
      toast.success(t("resourceGroupEditor.deleteResourceGroup.success"));
    },
    onError: () => {
      close();
    },
  });

  return {
    deleteResourceGroup: mutate,
    deleteResourceGroupAsync: mutateAsync,
    isDeleting: isPending,
  };
};
