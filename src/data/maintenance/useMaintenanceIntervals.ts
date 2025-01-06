import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalControllerApi } from "@/api";

type UseMaintenanceIntervalsParams = {
  clusterId: string | undefined;
  active: boolean;
  page: number;
  size: number;
}

export const useMaintenanceIntervals = ({
  clusterId, active, page, size
}: UseMaintenanceIntervalsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, clusterId, active, page, size ],
    queryFn: async () => {
      const controller = new MaintenanceIntervalControllerApi();
      const response = await controller.getAllMaintenanceIntervals(
        page, size, clusterId, active,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      return response.data.items ?? [];
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000
  });

  return { intervals: data, isLoading };
};