import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { TeamControllerApi } from "@/api";

export const useTeams = () => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM],
        queryFn: async () => {
            const teamController = new TeamControllerApi();
            const response = await teamController.getTeams();
            return response.data;
        },
    });

    return { teams: data, isLoading };
}