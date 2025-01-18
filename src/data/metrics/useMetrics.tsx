import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoMetricDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseMetricsParams = {
  page: number;
  size: number;
  sort: string[];
}

export const useMetrics = ({
  page, size, sort
}: UseMetricsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.METRICS, page, size, sort ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());
      sort.forEach((sortElement) => (searchParams.append("sort", sortElement)));

      const response = await privateAxios.get<PageDtoMetricDto>(
        `/metrics`, { params: searchParams }
      );
      return response.data?.items ?? [];
    },
  });

  return {metrics: data, isLoading};
}