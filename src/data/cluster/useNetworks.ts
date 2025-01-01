import {useQuery} from "@tanstack/react-query";
import {keys} from "@/data/keys";
import {ClusterControllerApi} from "@/api";

export const useNetworks = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.NETWORKS, id],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findNetworksByClusterId(id);
      return response.data;
    },
  });

  return { networks: data, isLoading };
}