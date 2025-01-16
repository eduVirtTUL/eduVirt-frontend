import { toast } from "sonner";
import { keys } from "../keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useDeleteStatelessPod = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await privateAxios.delete<void>(
        `/pods/stateless/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.STATELESS_POD] });
      queryClient.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP, 'withPods'] });
      toast.success("Stateless pod deleted successfully!");
    },
  });
    
  return { deleteStatelessPod: mutate, deleteStatelessPodAsync: mutateAsync, isPending };
};