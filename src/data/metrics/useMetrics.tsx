import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MetricControllerApi } from "@/api";

type UseMetricsParams = {
  page: number,
  size: number
}

export const useMetrics = ({
  page, size
}: UseMetricsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.METRICS, page, size ],
    queryFn: async () => {
      const controller = new MetricControllerApi();
      const response = await controller.getAllMetrics(
        page, size,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data?.items ?? [];
    },
  });

  return {metrics: data, isLoading};
}