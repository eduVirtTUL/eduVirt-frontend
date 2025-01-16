import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { PageDtoTeamWithCourseDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useUsersTeams = (pageNumber?: number, pageSize?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, pageNumber, pageSize],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("pageNumber", pageNumber?.toString() ?? "")
      searchParams.append("pageSize", pageSize?.toString() ?? "")

      const response = await privateAxios.get<PageDtoTeamWithCourseDto>(
        `/teams/student`, { params: searchParams }
      );

      return response.data;
    },
  });

  return { teams: data, isLoading };
}