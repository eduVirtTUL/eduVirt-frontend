import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "../privateAxios";
import { CourseStatsDto,TeamStatsDto} from "@/api/statistics";
import { keys } from "../keys";

export const useCourseStats = (courseId: string) => {
  return useQuery({
      queryKey: [keys.STATISTICS, "course", courseId],
      queryFn: async () => {
          const { data } = await privateAxios.get<CourseStatsDto>(`/course/${courseId}/statistics`);
          return data;
      },
      enabled: !!courseId,
  });
};

export const useTeamStats = (courseId: string, teamId: string) => {
  return useQuery({
    queryKey: [keys.STATISTICS, "team", courseId, teamId],
    queryFn: async () => {
      const { data } = await privateAxios.get<TeamStatsDto>(
        `/course/${courseId}/teams/${teamId}/statistics`
      );
      return data;
    },
    enabled: !!courseId && !!teamId,
  });
};
