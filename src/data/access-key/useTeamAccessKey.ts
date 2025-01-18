import { TeamAccessKeyDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

interface UseTeamAccessKeyOptions {
    enabled?: boolean
}

export const useTeamAccessKey = (id: string, options: UseTeamAccessKeyOptions = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.ACCESS_KEY, id],
    queryFn: async () => {
      const response = await privateAxios.get<TeamAccessKeyDto>(
        `/access-keys/team/${id}`
      );
      return response.data;
    },
    enabled: options.enabled
  });

  return { team: data, isLoading };
}