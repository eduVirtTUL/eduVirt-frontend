import { useQuery } from "@tanstack/react-query";
import { ResourceGroupVmControllerApi } from "@/api";
export const useResourceGroupVms = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id],
    queryFn: async () => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.getVms(id);
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
