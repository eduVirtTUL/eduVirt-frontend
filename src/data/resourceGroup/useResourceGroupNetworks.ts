import { ResourceGroupNetworkControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroupNetworks = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id, "networks"],
    queryFn: async () => {
      const controller = new ResourceGroupNetworkControllerApi();
      const response = await controller.get(id);
      return response.data;
    },
  });

  return { networks: data, isLoading };
};
