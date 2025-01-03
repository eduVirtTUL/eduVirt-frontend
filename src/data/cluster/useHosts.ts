import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterControllerApi } from "@/api";

export const useHosts = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.HOSTS, id],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findHostInfoByClusterId(id);
      return response.data;
    },
  });

  return { hosts: data, isLoading };
};
