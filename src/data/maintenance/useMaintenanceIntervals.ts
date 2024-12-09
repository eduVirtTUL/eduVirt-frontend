import {useQuery} from "@tanstack/react-query";
import {keys} from "@/data/keys.ts";
import {MaintenanceIntervalControllerApi} from "@/api";

export const useMaintenanceIntervals = (
    clusterId: string | undefined,
    active: boolean
) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.MAINTENANCE_INTERVALS],
        queryFn: async() => {
            const controller = new MaintenanceIntervalControllerApi();
            const response = await controller
                .getAllMaintenanceIntervals(undefined, undefined, clusterId, active);

            return response.data;
        }
    });

    return {intervals: data, isLoading};
}