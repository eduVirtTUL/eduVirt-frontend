import { ResourceGroupControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";

export const useResourceGroups = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getResourceGroups();
      return response.data;
    },
  });

  return { resourceGroups: data, isLoading };
};