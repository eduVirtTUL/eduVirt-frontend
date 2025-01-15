import { UpdateResourceGroupPoolDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceGroupPoolKeys } from "../keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";
import { useDialog } from "@/stores/dialogStore";

type UpdateResourceGroupPool = {
  id: string;
  etag: string;
} & UpdateResourceGroupPoolDto;

export const useUpdateResourceGroupPool = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { close } = useDialog();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateResourceGroupPool) => {
      await privateAxios.put(`/resource-group-pool/${id}`, org, {
        headers: {
          "If-Match": etag,
        },
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupPoolKeys.detail(id),
      });
      toast.success(t("editResourceGroupPoolModal.success"));
    },
    onError: () => {
      close();
    },
  });

  return {
    updateResourceGroupPool: mutate,
    updateResourceGroupPoolAsync: mutateAsync,
    isUpdating: isPending,
  };
};
