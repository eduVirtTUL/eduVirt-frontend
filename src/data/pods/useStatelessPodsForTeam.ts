import { PodStatelessDetailsDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useStatelessPodsForTeam = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.STATELESS_POD],
    queryFn: async () => {
      const response = await privateAxios.get<PodStatelessDetailsDto[]>(
        `/pods/stateless/team/${teamId}`
      );
      return response.data;
    },
  });

  return { statelessPods: data, isLoading };
}