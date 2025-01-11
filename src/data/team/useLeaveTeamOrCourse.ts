import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { keys } from "../keys";
import { toast } from "sonner";

export const useLeaveTeamOrCourse = () => {
    const queryClient = useQueryClient();

    const { mutate: leaveTeam } = useMutation({
        mutationFn: async (teamId: string) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const teamController = new TeamControllerApi();
            const response = await teamController.leaveTeam(teamId, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
            toast.success("Team left successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return { leaveTeam };
};