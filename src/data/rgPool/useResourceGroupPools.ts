import { ResourceGroupPoolControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

export const useResourceGroupPools = (page: number, size: number) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, page, size],
    queryFn: async () => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.getResourceGroupPools(page, size, {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { resourceGroupPools: data, isLoading };
};
