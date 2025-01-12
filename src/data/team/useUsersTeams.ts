import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { TeamControllerApi } from "@/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
}

export const useUsersTeams = (pageNumber?: number, pageSize?: number) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.TEAM, pageNumber, pageSize],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const decoded = jwtDecode<JwtPayload>(token);
            const userId = decoded.sub;

            const teamController = new TeamControllerApi();
            const response = await teamController.getTeamsByUser(userId, pageNumber, pageSize);
            return response.data;
        },
    });

    return { teams: data, isLoading };
}