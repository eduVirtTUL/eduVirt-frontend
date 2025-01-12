import { ResourceGroupControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroup = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getResourceGroup(id, {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { resourceGroup: data, isLoading };
};
