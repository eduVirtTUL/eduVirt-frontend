import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

type UseNetworksParams = {
  id: string,
  page: number,
  size: number
}

export const useNetworks = ({id, page, size}: UseNetworksParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.NETWORKS, id, page, size ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findNetworksByClusterId(
        id, page, size, { ...injectToken() }
      );
      return response.data ?? [];
    },
  });

  return { networks: data, isLoading };
}