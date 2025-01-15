import { ResourceGroupDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { useQuery } from "@tanstack/react-query";

export const useStatefulResourceGroups = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.resourceGroups(id),
    queryFn: async () => {
      const response = await privateAxios.get<ResourceGroupDto[]>(
        `/course/${id}/stateful`
      );
      return response.data;
    },
  });

  return { statefulResourceGroups: data, isLoading };
};
