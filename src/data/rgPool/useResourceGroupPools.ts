import { ResourceGroupPoolControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";

export const useResourceGroupPools = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP],
    queryFn: async () => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.getResourceGroupPools();
      return response.data;
    },
  });

  return { resourceGroupPools: data, isLoading };
};
