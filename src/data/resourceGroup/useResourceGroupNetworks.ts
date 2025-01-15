import { useQuery } from "@tanstack/react-query";
import { resourceGroupKeys } from "../keys";
import { ResourceGroupNetworkDto } from "@/api";
import { privateAxios } from "../privateAxios";

export const useResourceGroupNetworks = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: resourceGroupKeys.networks(id),
    queryFn: async () => {
      const response = await privateAxios.get<ResourceGroupNetworkDto[]>(
        `/resource-group/${id}/network`
      );
      return response.data;
    },
  });

  return { networks: data, isLoading };
};
