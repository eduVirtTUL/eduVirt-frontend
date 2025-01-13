import { useQuery } from "@tanstack/react-query";
import { ClusterMetricControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";

type UseClusterMetricsParams = {
  id: string;
  page: number;
  size: number;
}

export const useClusterMetrics = ({
  id, page, size
}: UseClusterMetricsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER_METRIC_VALUES, id, page, size ],
    queryFn: async() => {
      const controller = new ClusterMetricControllerApi();
      const response = await controller.getAllMetricValues(
        id, page, size, { ...injectToken() }
      );
      return response.data.items ?? [];
    },
  });

  return { metrics: data, isLoading };
};
