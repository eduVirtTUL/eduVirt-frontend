import { CourseControllerApi, CreateResourceGroupDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";
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
      const controller = new CourseControllerApi();
      const response = await controller.createResourceGroup(id, org, {
        ...injectToken(),
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.resourceGroups(id),
      });
      toast.success(t("createResourceGroupModal.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("createResourceGroupModal.error"));
    },
  });

  return {
    createResourceGroup: mutate,
    createResourceGroupAsync: mutateAsync,
    isPending,
  };
};
