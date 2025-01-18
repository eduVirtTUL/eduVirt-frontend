import { useQuery } from "@tanstack/react-query";
import { PageDtoMetricValueDto } from "@/api";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

type UseClusterMetricsParams = {
  id: string;
  page: number;
  size: number;
  sort: string[];
}

export const useClusterMetrics = ({
  id, page, size, sort
}: UseClusterMetricsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER_METRIC_VALUES, id, page, size, sort ],
    queryFn: async() => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());
      sort.forEach((sortElement) => (searchParams.append("sort", sortElement)));

      const response = await privateAxios.get<PageDtoMetricValueDto>(
        `/clusters/${id}/metrics`, { params: searchParams }
      );
      return response.data.items ?? [];
    },
  });

  return { metrics: data, isLoading };
};
