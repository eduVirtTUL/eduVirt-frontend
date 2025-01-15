import { PageDtoDetailedResourceGroupPoolDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";

export const useResourceGroupPools = (page: number, size: number) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, page, size],
    queryFn: async () => {
      const response =
        await privateAxios.get<PageDtoDetailedResourceGroupPoolDto>(
          `/resource-group-pool`,
          {
            params: { page, size },
          }
        );
      return response.data;
    },
  });

  return { resourceGroupPools: data, isLoading };
};
