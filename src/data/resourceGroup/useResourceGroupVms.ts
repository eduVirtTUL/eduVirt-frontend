import { useQuery } from "@tanstack/react-query";
import { VmDto } from "@/api";
import { privateAxios } from "../privateAxios";
export const useResourceGroupVms = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id, "vm"],
    queryFn: async () => {
      const response = await privateAxios.get<VmDto[]>(
        `/resource-group/${id}/vm`
      );
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
