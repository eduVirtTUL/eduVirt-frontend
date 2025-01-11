import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { ResourceGroupNetworkControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

export const useResourceGroupNetworks = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.networks(id),
    queryFn: async () => {
      const controller = new ResourceGroupNetworkControllerApi();
      const response = await controller.get(id, { ...injectToken() });
      return response.data;
    },
  });

  return { networks: data, isLoading };
};
