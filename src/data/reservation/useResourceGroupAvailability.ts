import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { CourseControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

export const useResourceGroupAvailability = (
  id: string,
  resourceGroup: string,
  timeWindow: number,
  start: string,
  end: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.COURSE_RESOURCES, id, resourceGroup, start, end ],
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.findResourcesAvailabilityForResourceGroup(
        id, resourceGroup, timeWindow, start, end,
          { ...injectToken() }
      );

      return response.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  return { resources: data, isLoading };
}