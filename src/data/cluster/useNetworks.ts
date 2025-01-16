import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { NetworkDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseNetworksParams = {
  id: string,
  page: number,
  size: number
}

export const useNetworks = ({id, page, size}: UseNetworksParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.NETWORKS, id, page, size ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      const response = await privateAxios.get<NetworkDto[]>(
        `/clusters/${id}/networks`, { params: searchParams }
      );
      return response.data ?? [];
    },
  });

  return { networks: data, isLoading };
}