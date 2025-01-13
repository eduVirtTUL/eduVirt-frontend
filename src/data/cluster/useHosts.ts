import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ClusterControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

type UseHostsParams = {
  id: string,
  page: number,
  size: number,
  sort: Array<string>
}

export const useHosts = ({
  id, page, size, sort
}: UseHostsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.HOSTS, id, page, size, sort ],
    queryFn: async () => {
      const controller = new ClusterControllerApi();
      const response = await controller.findHostInfoByClusterId(
        { page: page, size: size, sort: sort }, id, { ...injectToken() }
      );
      return response.data ?? [];
    },
  });

  return { hosts: data, isLoading };
};
