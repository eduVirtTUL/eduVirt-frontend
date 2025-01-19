import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { PageDtoTeamWithKeyDto } from "@/api";

export const useCoursesTeamsByEmail = (
  courseId: string,
  emailPrefixes: string[],
  pageNumber?: number,
  pageSize?: number,
  sortOrder?: "ASC" | "DESC"
) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, "byEmail", courseId, emailPrefixes, pageNumber, pageSize, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      emailPrefixes.forEach(email => params.append("emailPrefixes", email));
      if (pageNumber !== undefined) params.append("pageNumber", pageNumber.toString());
      if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
      if (sortOrder) params.append("sort", sortOrder);

      const response = await privateAxios.get<PageDtoTeamWithKeyDto>(
        `/teams/course/${courseId}/search-emails`,
        { params }
      );

      return response.data;
    },
    enabled: !!courseId && emailPrefixes.length > 0,
  });

  return { teams: data, isLoading };
};