import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { TeamControllerApi } from "@/api";

export const useCourseTeams = (courseId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM, courseId],
        queryFn: async () => {
            const teamController = new TeamControllerApi();
            const response = await teamController.getTeamsByCourse(courseId);
            return response.data;
        },
        enabled: !!courseId,
    });

    return { teams: data, isLoading };
};