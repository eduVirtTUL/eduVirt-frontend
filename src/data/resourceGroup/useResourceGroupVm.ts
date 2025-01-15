import { VmDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { stripEtag } from "@/utils/requestUtils";
import { privateAxios } from "../privateAxios";

export const useVm = (vmId: string) => {
  const { id } = useResourceGroupEditorStore();
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.vm(id!, vmId),
    queryFn: async () => {
      const response = await privateAxios.get<VmDto>(
        `/resource-group/${id}/vm/${vmId}`
      );

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { vm: data?.data, etag: data?.etag, isLoading };
};
