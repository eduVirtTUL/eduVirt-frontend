import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { keys } from "../keys";
import { toast } from "sonner";

export const useRemoveUserFromTeam = (teamId: string) => {
    const queryClient = useQueryClient();
    
    const { mutateAsync: removeUser } = useMutation({
        mutationFn: async (userId: string) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const teamController = new TeamControllerApi();
            const response = await teamController.removeUserFromTeam(teamId, userId, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
            toast.success("User removed from team");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return { removeUser };
};
