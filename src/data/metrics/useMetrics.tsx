import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoMetricDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

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
      const response = await privateAxios.get<PageDtoMetricDto>(`/metrics`);
      return response.data?.items ?? [];
    },
  });

  return {metrics: data, isLoading};
}