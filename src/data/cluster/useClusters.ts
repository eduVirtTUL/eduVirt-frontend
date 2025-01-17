import { useQuery } from "@tanstack/react-query";
import { ClusterGeneralDto } from "@/api";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

type UseClustersParams = {
  page: number;
  size: number;
  sort: Array<string>;
};

export const useClusters = ({ page, size, sort }: UseClustersParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.CLUSTER, page, size, sort],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      sort.forEach((sortElement) => (
          searchParams.append("sort", sortElement)
      ));

      const response = await privateAxios.get<ClusterGeneralDto[]>(
        `/clusters`, { params: searchParams }
      );
      return response.data;
    },
  });

  return { clusters: data, isLoading };
};
