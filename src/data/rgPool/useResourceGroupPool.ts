import { DetailedResourceGroupPoolDto } from "@/api";
import { stripEtag } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "../privateAxios";

export const useResourceGroupPool = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroupPool", id],
    queryFn: async () => {
      const response = await privateAxios.get<DetailedResourceGroupPoolDto>(
        `/resource-group-pool/${id}`
      );

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { resourceGroupPool: data?.data, etag: data?.etag, isLoading };
};
