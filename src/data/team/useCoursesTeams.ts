import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { TeamControllerApi } from "@/api";


export const useCourseTeams = (courseId: string, pageNumber?: number, pageSize?: number) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM, courseId, pageNumber, pageSize],
        queryFn: async () => {
            const teamController = new TeamControllerApi();
            const response = await teamController.getTeamsByCourse(courseId, pageNumber, pageSize);
            return {
                ...response.data,
                items: response.data.items ?? [],
            };
        },
        enabled: !!courseId,
    });

    return { teams: data, isLoading };
};