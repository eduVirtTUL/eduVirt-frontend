import { ResourceGroupPoolControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroupPool = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroupPool", id],
    queryFn: async () => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.getResourceGroupPool(id, {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { resourceGroupPool: data, isLoading };
};
