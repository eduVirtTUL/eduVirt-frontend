import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { PageDtoTeamWithKeyDto } from "@/api";

export type SearchType = "TEAM_NAME" | "STUDENT_NAME" | "STUDENT_EMAIL";

export const useCourseTeams = (
  courseId: string,
  pageNumber?: number,
  pageSize?: number,
  search?: string,
  searchType?: SearchType,
  sortOrder?: "ASC" | "DESC"
) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, courseId, pageNumber, pageSize, search, searchType, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (pageNumber !== undefined) params.append("pageNumber", pageNumber.toString());
      if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
      if (search) params.append("search", search);
      if (searchType) params.append("searchType", searchType);
      if (sortOrder) params.append("sort", sortOrder);

      const response = await privateAxios.get<PageDtoTeamWithKeyDto>(
        `/teams/course/${courseId}`,
        { params }
      );

      return {
        ...response.data,
        items: response.data.items ?? [],
      };
    },
    enabled: !!courseId,
  });

  return { teams: data, isLoading };
};