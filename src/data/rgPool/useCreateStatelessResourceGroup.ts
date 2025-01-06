import { CreateResourceGroupDto, ResourceGroupPoolControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupPoolKeys } from "../keys";

type CreateStatelessResourceGroup = {
  id: string;
} & Required<CreateResourceGroupDto>;

export const useCreateStatelessResourceGroup = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: CreateStatelessResourceGroup) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.addResourceGroupToPool(id, org);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupPoolKeys.detail(id),
      });
      toast.success("Resource group created");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create resource group");
    },
  });

  return {
    createStatelessResourceGroup: mutate,
    createStatelessResourceGroupAsync: mutateAsync,
    isPending,
  };
};
