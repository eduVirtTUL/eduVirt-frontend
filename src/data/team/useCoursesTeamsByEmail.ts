import { SearchTeamsByEmailsDto, TeamWithKeyDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";

export const useCoursesTeamsByEmail = (
  courseId: string,
  emailPrefixes: string[],
  sortOrder?: "ASC" | "DESC"
) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, "byEmail", courseId, emailPrefixes, sortOrder],
    queryFn: async () => {
      const searchDto: SearchTeamsByEmailsDto = {
        emailPrefixes,
        sort: sortOrder
      };
      
      const response = await privateAxios.post<TeamWithKeyDto[]>(
        `/teams/course/${courseId}/search-emails`,
        searchDto
      );
      return response.data;
    },
    enabled: !!courseId && emailPrefixes.length > 0
  });

  return { teams: data, isLoading };
};