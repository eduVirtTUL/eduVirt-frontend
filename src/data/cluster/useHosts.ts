import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterControllerApi } from "@/api";

type UseHostsParams = {
  id: string,
  page: number,
  size: number
}

export const useHosts = ({id, page, size}: UseHostsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.HOSTS, id, page, size ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findHostInfoByClusterId(
        id, page, size,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data ?? [];
    },
  });

  return { hosts: data, isLoading };
};
