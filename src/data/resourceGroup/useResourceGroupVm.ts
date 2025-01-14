import { ResourceGroupVmControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { injectToken, stripEtag } from "@/utils/requestUtils";

export const useVm = (vmId?: string) => {
  const { id } = useResourceGroupEditorStore();
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.vm(id ?? "", vmId ?? ""),
    queryFn: async () => {
      if (!vmId) {
        return undefined;
      }

      const controller = new ResourceGroupVmControllerApi();
      const response = await controller.getVm(id ?? "", vmId, {
        ...injectToken(),
      });

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { vm: data?.data, etag: data?.etag, isLoading };
};
