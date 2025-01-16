import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalDetailsDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useMaintenanceInterval = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, id ],
    queryFn: async () => {
      const response = await privateAxios.get<MaintenanceIntervalDetailsDto>(
        `/maintenance-intervals/${id}`
      );
      return response.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000
  });

  return { interval: data, isLoading };
};