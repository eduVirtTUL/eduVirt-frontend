import { CreateResourceGroupDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupPoolKeys } from "../keys";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

type CreateStatelessResourceGroup = {
  id: string;
} & CreateResourceGroupDto;

export const useCreateStatelessResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: CreateStatelessResourceGroup) => {
      await privateAxios.post(`/resource-group-pool/${id}/resourceGroup`, org);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupPoolKeys.detail(id),
      });
      toast.success(t("createResourceGroupModal.success"));
    },
  });

  return {
    createStatelessResourceGroup: mutate,
    createStatelessResourceGroupAsync: mutateAsync,
    isPending,
  };
};
