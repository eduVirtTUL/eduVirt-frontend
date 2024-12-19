import { useQuery } from "@tanstack/react-query";
import { ClusterControllerApi } from "@/api";
import { keys } from "@/data/keys";

export const useClusters = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.CLUSTER],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findAllClusters();

      return response.data;
    },
  });

  return { clusters: data, isLoading };
};
