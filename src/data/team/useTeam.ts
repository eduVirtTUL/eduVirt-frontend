import { useQuery } from "@tanstack/react-query";
import { TeamWithCourseDto } from "@/api";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { stripEtag } from "@/utils/requestUtils";

export const useTeam = (id: string, options?: { enabled?: boolean }) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, id],
    queryFn: async () => {
      const response = await privateAxios.get<TeamWithCourseDto>(`/teams/${id}`);
      const etag = response.headers["etag"] as string;
      return {
        team: response.data,
        etag: stripEtag(etag)
      };
    },
    enabled: options?.enabled
  });

  return { team: data?.team, etag: data?.etag, isLoading };
};