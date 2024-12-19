import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaintenanceIntervalControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";

export const useRemoveMaintenanceInterval = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["removeMaintenanceInterval"],
    mutationFn: async (maintenanceIntervalId: string) => {
      const controller = new MaintenanceIntervalControllerApi();
      const response = await controller.finishMaintenanceInterval(
        maintenanceIntervalId
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS] });
      toast.success("Maintenance interval cancelled successfully!");
    },
    onError: () => {
      toast.error("Failed to cancel maintenance interval.");
    },
  });

  return {
    removeMaintenanceInterval: mutate,
    removeMaintenanceIntervalAsync: mutateAsync,
  };
};
