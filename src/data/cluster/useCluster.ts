import { useQuery } from "@tanstack/react-query";
import { ClusterControllerApi } from "@/api";
import { keys } from "@/data/keys";

export const useCluster = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER, id ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findClusterById(
        id, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    },
  });

  return { cluster: data, isLoading };
};
