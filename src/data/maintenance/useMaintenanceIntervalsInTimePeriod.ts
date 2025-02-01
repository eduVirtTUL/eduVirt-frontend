import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useMaintenanceIntervalsInTimePeriod = (
  clusterId: string | undefined = undefined,
  start: string | null,
  end: string | null
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, clusterId, start, end ],
    queryFn: async () => {
      if (start == null || end == null) return [];

      const searchParams = new URLSearchParams();

      searchParams.append("clusterId", clusterId ?? '');
      searchParams.append("start", start);
      searchParams.append("end", end);

      const response = await privateAxios.get<MaintenanceIntervalDto[]>(
        `/maintenance-intervals/time-period`, { params: searchParams }
      );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return { intervals: data, isLoading };
};
