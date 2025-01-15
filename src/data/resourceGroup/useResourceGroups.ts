import { ResourceGroupDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";

export const useResourceGroups = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP],
    queryFn: async () => {
      const response =
        await privateAxios.get<ResourceGroupDto[]>(`/resource-group`);
      return response.data;
    },
  });

  return { resourceGroups: data, isLoading };
};
