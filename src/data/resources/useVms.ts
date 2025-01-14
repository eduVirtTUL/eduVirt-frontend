import { VmDto } from "@/api";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "../privateAxios";

export const useVms = () => {
  const { id } = useResourceGroupEditorStore();
  const { data, isLoading } = useQuery({
    queryKey: ["vm"],
    queryFn: async () => {
      const response = await privateAxios.get<VmDto[]>(
        `/resource-group/${id}/vm/available`
      );
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
