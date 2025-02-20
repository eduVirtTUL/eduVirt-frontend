import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoMaintenanceIntervalDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseMaintenanceIntervalsParams = {
  clusterId: string | undefined;
  active: boolean;
  page: number;
  size: number;
  sort: string[];
}

export const useMaintenanceIntervals = ({
  clusterId, active, page, size, sort
}: UseMaintenanceIntervalsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.MAINTENANCE_INTERVALS, clusterId, active, page, size, sort ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());
      searchParams.append("clusterId", clusterId ?? '');
      searchParams.append("active", active.toString());
      sort.forEach((sortElement) => (searchParams.append("sort", sortElement)));

      const response = await privateAxios.get<PageDtoMaintenanceIntervalDto>(
        `/maintenance-intervals`, {params: searchParams}
      );
      return response.data.items ?? [];
    }
  });

  return { intervals: data, isLoading };
};