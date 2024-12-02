import { ResourceGroupControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroups = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup"],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getResourceGroups();
      return response.data;
    },
  });

  return { resourceGroups: data, isLoading };
};
