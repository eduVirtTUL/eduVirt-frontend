import { ResourceGroupPoolControllerApi } from "@/api";
import { injectToken, stripEtag } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroupPool = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroupPool", id],
    queryFn: async () => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.getResourceGroupPool(id, {
        ...injectToken(),
      });

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { resourceGroupPool: data?.data, etag: data?.etag, isLoading };
};
