import {
  ResourceGroupPoolControllerApi,
  UpdateResourceGroupPoolDto,
} from "@/api";
import { useMutation } from "@tanstack/react-query";

type UpdateResourceGroupPool = {
  id: string;
} & Required<UpdateResourceGroupPoolDto>;

export const useUpdateResourceGroupPool = () => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: UpdateResourceGroupPool) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.updateResourceGroupPool(id, org);
      return response.data;
    },
  });

  return {
    updateResourceGroupPool: mutate,
    updateResourceGroupPoolAsync: mutateAsync,
    isUpdating: isPending,
  };
};
