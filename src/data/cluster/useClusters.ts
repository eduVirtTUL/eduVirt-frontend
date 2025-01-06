import { useQuery } from "@tanstack/react-query";
import { ClusterControllerApi } from "@/api";
import { keys } from "@/data/keys";

type UseClustersParams = {
  page: number;
  size: number;
}

export const useClusters = ({ page, size }: UseClustersParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER, page, size ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findAllClusters(
        page, size,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    },
  });

  return { clusters: data, isLoading };
};
