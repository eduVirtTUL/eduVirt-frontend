import { ResourceGroupPoolControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroupPool = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroupPool", id],
    queryFn: async () => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.getResourceGroupPool(id);
      return response.data;
    },
  });

  return { resourceGroupPool: data, isLoading };
};
