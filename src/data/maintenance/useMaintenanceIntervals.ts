import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MaintenanceIntervalControllerApi } from "@/api";

export const useMaintenanceIntervals = (
    clusterId: string | undefined,
    active: boolean,
) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.MAINTENANCE_INTERVALS, clusterId, active],
        queryFn: async () => {
            const controller = new MaintenanceIntervalControllerApi();
            const response = await controller.getAllMaintenanceIntervals(
                undefined,
                undefined,
                clusterId,
                active
            );

            return response.data;
        },
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        staleTime: 30000
    });

    return { intervals: data, isLoading };
};