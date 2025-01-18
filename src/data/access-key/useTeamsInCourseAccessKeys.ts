import { useQueries } from "@tanstack/react-query"
import { keys } from "../keys"
import { TeamAccessKeyDto } from "@/api"
import { privateAxios } from "@/data/privateAxios";

export const useTeamsInCourseAccessKeys = (teamIds: string[], enabled: boolean) => {
  return useQueries({
    queries: teamIds.map(id => ({
      queryKey: [keys.ACCESS_KEY, id],
      queryFn: async () => {
        const response = await privateAxios.get<TeamAccessKeyDto>(
          `/access-keys/team/${id}`
        );
        return { id, key: response.data }
      },
    enabled: enabled
    }))
  })
}