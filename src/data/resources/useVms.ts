import { ResourceGroupVmControllerApi } from "@/api";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useVms = () => {
  const { id } = useResourceGroupEditorStore();
  const { data, isLoading } = useQuery({
    queryKey: ["vm"],
    queryFn: async () => {
      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.getAvailableVms(id ?? "", {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
