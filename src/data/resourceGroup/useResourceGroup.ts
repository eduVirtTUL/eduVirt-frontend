import { ResourceGroupControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroup = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup"],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getResourceGroup(id);
      return response.data;
    },
  });

  return { resourceGroup: data, isLoading };
};
