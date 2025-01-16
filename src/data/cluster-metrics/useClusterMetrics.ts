import { useQuery } from "@tanstack/react-query";
import { PageDtoMetricValueDto } from "@/api";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

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
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      const response = await privateAxios.get<PageDtoMetricValueDto>(
        `/clusters/${id}/metrics`, { params: searchParams }
      );
      return response.data.items ?? [];
    },
  });

  return { metrics: data, isLoading };
};
