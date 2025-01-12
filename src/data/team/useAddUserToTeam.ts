import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { keys } from "../keys";
import { toast } from "sonner";

export const useAddUserToTeam = (teamId: string) => {
    const queryClient = useQueryClient();
    
    const { mutateAsync: addUser } = useMutation({
        mutationFn: async (userId: string) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const teamController = new TeamControllerApi();
            const response = await teamController.addUserToTeam(teamId, userId, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.TEAM_USERS(teamId) });
            toast.success("User added to team");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return { addUser };
};
