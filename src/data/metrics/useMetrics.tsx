import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MetricControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

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
        page, size, { ...injectToken() }
      );
      return response.data?.items ?? [];
    },
  });

  return {metrics: data, isLoading};
}