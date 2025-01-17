import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { PageDtoTeamDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

export const useCourseTeams = (courseId: string, pageNumber?: number, pageSize?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, courseId, pageNumber, pageSize],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("pageNumber", pageNumber?.toString() ?? "");
      searchParams.append("pageSize", pageSize?.toString() ?? "");

      const response = await privateAxios.get<PageDtoTeamDto>(
        `/teams/course/${courseId}`, { params: searchParams }
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