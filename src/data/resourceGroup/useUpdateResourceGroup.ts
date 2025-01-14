import { ResourceGroupDto, UpdateResourceGroupDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { privateAxios } from "../privateAxios";

type UpdateResourceGroup = {
  id: string;
  etag: string;
} & UpdateResourceGroupDto;

export const useUpdateResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateResourceGroup) => {
      const response = await privateAxios.put<ResourceGroupDto>(
        `/resource-group/${id}`,
        org,
        {
          headers: {
            "If-Match": etag,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id] });
      toast.success(t("resourceGroupEditor.updateResourceGroup.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("resourceGroupEditor.updateResourceGroup.error"));
    },
  });

  return {
    updateResourceGroup: mutate,
    updateResourceGroupAsync: mutateAsync,
    isUpdating: isPending,
  };
};
