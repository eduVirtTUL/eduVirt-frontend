import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { ResourceGroupNetworkControllerApi } from "@/api";

export const useResourceGroupNetworks = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.networks(id),
    queryFn: async () => {
      const controller = new ResourceGroupNetworkControllerApi();
      const response = await controller.get(id);
      return response.data;
    },
  });

  return { networks: data, isLoading };
};
