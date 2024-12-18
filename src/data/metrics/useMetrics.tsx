import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { MetricControllerApi } from "@/api";

export const useMetrics = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.METRICS],
    queryFn: async () => {
      const controller = new MetricControllerApi();
      const response = await controller.getAllMetrics();
      return response.data;
    },
  });

  return { metrics: data, defaultMetric: data?.items?.[0], isLoading };
};
