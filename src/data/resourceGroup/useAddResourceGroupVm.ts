import { AddVmDto } from "./../../api/api";
import { ResourceGroupVmControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddResourceGroupVm = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: AddVmDto) => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.addVm(id, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the resourceGroupVms query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["resourceGroup", id] });
      queryClient.invalidateQueries({ queryKey: ["vm"] });
      toast.success("VM added successfully!");
    },
    onError: () => [toast.error("Failed to add VM")],
  });

  return { addVm: mutate };
};
