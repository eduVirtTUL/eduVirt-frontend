import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { PageDtoTeamWithCourseDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useUsersTeams = (
  pageNumber?: number,
  pageSize?: number,
  search?: string,
  sortOrder?: "ASC" | "DESC"
) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      keys.TEAM,
      pageNumber,
      pageSize,
      search,
      sortOrder
    ],
    queryFn: async () => {
      const response = await privateAxios.get<PageDtoTeamWithCourseDto>(
        `/teams/student`,
        {
          params: {
            page: pageNumber,
            size: pageSize,
            search,
            sort: sortOrder
          }
        }
      );
      return response.data;
    },
  });

  return { teams: data, isLoading };
}