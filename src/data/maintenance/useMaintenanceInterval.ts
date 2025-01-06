import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalControllerApi } from "@/api";

export const useMaintenanceInterval = (
  intervalId: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, intervalId ],
    queryFn: async () => {
      const controller = new MaintenanceIntervalControllerApi();
      const response = await controller
        .getMaintenanceInterval(
          intervalId, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

      return response.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000
  });

  return { interval: data, isLoading };
};