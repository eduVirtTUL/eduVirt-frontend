import { ResourceGroupDto } from "@/api";
import { stripEtag } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "../privateAxios";

export const useResourceGroup = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["resourceGroup", id],
    queryFn: async () => {
      const response = await privateAxios.get<ResourceGroupDto>(
        `/resource-group/${id}`
      );

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { resourceGroup: data?.data, etag: data?.etag, isLoading };
};
