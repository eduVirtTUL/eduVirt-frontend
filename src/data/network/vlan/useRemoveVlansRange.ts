import { VlansRangeControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../../keys";

export const useRemoveVlansRange = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["removeVlansRange"],
    mutationFn: async (vlansRangeId: string) => {
      const controller = new VlansRangeControllerApi();
      const response = await controller.removeVlansRange(vlansRangeId);
      return response.data;
    },
    onSuccess: () => {
      // Force to refetch vlans ranges
      queryClient.invalidateQueries({ queryKey: [keys.VLANS_RANGE] });
      toast.success("VLANs range removed successfully!");
    },
    onError: () => {
      toast.error("Failed to remove VLANs range!");
    },
  });

  return { removeVlansRange: mutate, removeVlansRangeAsync: mutateAsync };
};
