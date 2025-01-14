import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

export const useMaintenanceIntervalsInTimePeriod = (
  clusterId: string | undefined = undefined,
  start: string | null,
  end: string | null
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, clusterId, start, end ],
    queryFn: async () => {
      if (start == null || end == null) return [];

      const controller = new MaintenanceIntervalControllerApi();
      const response = await controller.getMaintenanceIntervalsWithinTimePeriod(
        start, end, clusterId, { ...injectToken() }
      );

      if (response.status === 204) return [];
      return response.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000
  });

  return { intervals: data, isLoading };
};
