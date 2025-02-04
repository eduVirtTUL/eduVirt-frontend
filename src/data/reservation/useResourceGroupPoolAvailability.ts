import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ResourcesAvailabilityDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useResourceGroupPoolAvailability = (
  id: string,
  resourceGroupPool: string,
  start: string,
  end: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.COURSE_RESOURCES, id, resourceGroupPool, start, end ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("start", start);
      searchParams.append("end", end);

      const response = await privateAxios.get<ResourcesAvailabilityDto[]>(
        `/course/${id}/resource-group-pools/${resourceGroupPool}/availability`, { params: searchParams }
      );
      return response.data;
    }
  });

  return { resources: data, isLoading };
}