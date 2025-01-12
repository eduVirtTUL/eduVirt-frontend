import { useQuery } from "@tanstack/react-query";
import { ResourceGroupVmControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";
export const useResourceGroupVms = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id, "vm"],
    queryFn: async () => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.getVms(id, { ...injectToken() });
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
