import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceGroupPoolKeys } from "../keys";
import { toast } from "sonner";
import { privateAxios } from "../privateAxios";

export const useDeleteResourceGroupPool = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.delete(`/resource-group-pool/${id}`);
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
