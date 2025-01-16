import { PodStatefulDetailsDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useStatefulPodsForTeam = (teamId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.POD],
    queryFn: async () => {
      const response = await privateAxios.get<PodStatefulDetailsDto[]>(
        `/pods/stateful/team/${teamId}`
      );
      return response.data;
    },
  });

  return { statefulPods: data, isLoading };
}