import { ResourceGroupPoolControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceGroupPoolKeys } from "../keys";
import { toast } from "sonner";
import { injectToken } from "@/utils/requestUtils";

export const useDeleteResourceGroupPool = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.deleteResourceGroupPool(id, {
        ...injectToken(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceGroupPoolKeys.all });
      toast.success("Pula grup zasobów została usunięta");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Nie udało się usunąć puli grup zasobów");
    },
  });

  return {
    deleteResourceGroupPool: mutate,
    deleteResourceGroupPoolAsync: mutateAsync,
    isDeleting: isPending,
  };
};
