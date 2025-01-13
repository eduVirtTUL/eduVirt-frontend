import { useQuery } from "@tanstack/react-query";
import { ClusterControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";

type UseClustersParams = {
  page: number;
  size: number;
  sort: Array<string>;
}

export const useClusters = ({
  page, size, sort
}: UseClustersParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER, page, size, sort ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findAllClusters(
        { page: page, size: size, sort: sort }, { ...injectToken() }
      );
      return response.data;
    },
  });

  return { clusters: data, isLoading };
};
