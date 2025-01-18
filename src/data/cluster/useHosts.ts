import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { HostDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseHostsParams = {
  id: string;
  page: number;
  size: number;
  sort: string[];
}

export const useHosts = ({
  id, page, size, sort
}: UseHostsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.HOSTS, id, page, size, sort ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());
      sort.forEach((sortElement) => searchParams.append("sort", sortElement));

      sort.forEach((sortElement) => (
          searchParams.append("sort", sortElement)
      ));

      const response = await privateAxios.get<HostDto[]>(
        `/clusters/${id}/hosts`, { params: searchParams }
      );
      return response.data ?? [];
    },
  });

  return { hosts: data, isLoading };
};
