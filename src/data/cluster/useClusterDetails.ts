import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterDetailsDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useClusterDetails = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER, id ],
    queryFn: async () => {
      const response = await privateAxios.get<ClusterDetailsDto>(`/clusters/${id}`);
      return response.data;
    },
  });

  return { cluster: data, isLoading };
};
