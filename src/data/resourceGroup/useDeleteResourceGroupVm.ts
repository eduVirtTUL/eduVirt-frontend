import { ResourceGroupVmControllerApi } from "@/api";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";

export const useDeleteResourceGroupVm = () => {
  const { id: rgId } = useResourceGroupEditorStore();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.deleteVm(rgId!, id);
      return response.data;
    },
    onSuccess: (_, vmId) => {
      // Invalidate the resourceGroupVms query to refetch the data
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.detail(rgId!),
      });
      queryClient.invalidateQueries({ queryKey: ["vm"] });
      queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.vm(rgId!, vmId),
      });
      toast.success("VM deleted successfully!");
    },
    onError: () => [toast.error("Failed to delete VM")],
  });

  return { deleteVm: mutate, deleteVmAsync: mutateAsync, isPending };
};
