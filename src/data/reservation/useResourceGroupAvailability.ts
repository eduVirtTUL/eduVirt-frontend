import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ResourcesAvailabilityDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useResourceGroupAvailability = (
  id: string,
  resourceGroup: string,
  start: string,
  end: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.COURSE_RESOURCES, id, resourceGroup, start, end ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("start", start);
      searchParams.append("end", end);

      const response = await privateAxios.get<ResourcesAvailabilityDto[]>(
        `/course/${id}/resource-groups/${resourceGroup}/availability`, { params: searchParams }
      );
      return response.data;
    }
  });

  return { resources: data, isLoading };
}