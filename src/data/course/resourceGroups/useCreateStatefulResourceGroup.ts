import { CreateResourceGroupDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type CreateResourceGroup = {
  id: string;
} & CreateResourceGroupDto;

export const useCreateStatefulResourceGroup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: CreateResourceGroup) => {
      await privateAxios.post(`/course/${id}/resource-group`, org);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.resourceGroups(id),
      });
      toast.success(t("createResourceGroupModal.success"));
    },
  });

  return {
    createResourceGroup: mutate,
    createResourceGroupAsync: mutateAsync,
    isPending,
  };
};
