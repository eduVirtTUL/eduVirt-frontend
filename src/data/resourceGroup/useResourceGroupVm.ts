import { ResourceGroupVmControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";

export const useVm = (vmId?: string) => {
  const { id } = useResourceGroupEditorStore();
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.vm(id ?? "", vmId ?? ""),
    queryFn: async () => {
      if (!vmId) {
        return undefined;
      }

      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.getVm(id ?? "", vmId);
      return response.data;
    },
  });

  return { vm: data, isLoading };
};
