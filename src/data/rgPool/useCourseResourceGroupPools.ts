import { ResourceGroupPoolDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";

export const useCourseResourceGroupPools = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, id],
    queryFn: async () => {
      const response = await privateAxios.get<ResourceGroupPoolDto[]>(
        `/course/${id}/resource-group-pools`
      );
      return response.data;
    },
  });

  return { courseResourceGroupPools: data, isLoading };
};
