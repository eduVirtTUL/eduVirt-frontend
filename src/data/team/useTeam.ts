import { useQuery } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { keys } from "../keys";
export const useTeam = (id: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM, id],
        queryFn: async () => {
            const controller = new TeamControllerApi();
            const response = await controller.getTeamDetails(id);
            return response.data;
        },
    });

    return { team: data, isLoading };
};
