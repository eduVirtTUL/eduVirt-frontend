import { ResourceGroupControllerApi } from "@/api";
import { injectToken, stripEtag } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useResourceGroup = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getResourceGroup(id, {
        ...injectToken(),
      });

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { resourceGroup: data?.data, etag: data?.etag, isLoading };
};
