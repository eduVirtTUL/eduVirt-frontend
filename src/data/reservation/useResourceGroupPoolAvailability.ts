import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { CourseControllerApi } from "@/api";

export const useResourceGroupPoolAvailability = (
    id: string,
    resourceGroupPool: string,
    timeWindow: number,
    start: string,
    end: string
) => {
    const { data, isLoading } = useQuery({
        queryKey: [ keys.COURSE_RESOURCES, id, resourceGroupPool, start, end ],
        queryFn: async () => {
            const controller = new CourseControllerApi();
            const response = await controller.findResourcesAvailabilityForResourceGroupPool(
                id, resourceGroupPool, timeWindow, start, end,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            return response.data;
        },
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        staleTime: 30000,
    });

    return { resources: data, isLoading };
}