import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

export const useClusterDetails = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER, id ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findClusterById(
        id, { ...injectToken() }
      );
      return response.data;
    },
  });

  return { cluster: data, isLoading };
};
