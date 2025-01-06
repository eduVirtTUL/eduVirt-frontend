import { PodControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../keys";
import { toast } from "sonner";

export const useDeleteStatefulPod = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new PodControllerApi();
      const response = await controller.deleteStatefulPod(id);
      return response.data;
    },
    onSuccess: (_, podId) => {
      queryClient.invalidateQueries({ queryKey: [keys.POD] });
      queryClient.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP, 'withPods'] });
      queryClient.invalidateQueries({ queryKey: keys.POD, id: podId });
      toast.success("Stateful pod deleted successfully!");
    },
    onError: () => [toast.error("Failed to delete stateful pod")],
  });

  return { deleteStatefulPod: mutate, deleteStatefulPodAsync: mutateAsync, isPending };
}