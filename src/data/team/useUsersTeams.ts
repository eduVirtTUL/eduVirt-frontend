import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { TeamControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

export const useUsersTeams = (pageNumber?: number, pageSize?: number) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM, pageNumber, pageSize],
        queryFn: async () => {
            const teamController = new TeamControllerApi();
            const response = await teamController.getTeamsByStudent(pageNumber, pageSize, { ...injectToken() });
            return response.data;
        },
    });

    return { teams: data, isLoading };
}