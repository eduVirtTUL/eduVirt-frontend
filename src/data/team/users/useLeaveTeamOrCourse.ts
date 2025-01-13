import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { toast } from "sonner";
import { injectToken } from "@/utils/requestUtils";
import { keys } from "@/data/keys";

export const useLeaveTeamOrCourse = () => {
    const queryClient = useQueryClient();

    const { mutate: leaveTeam } = useMutation({
        mutationFn: async (teamId: string) => {
            const teamController = new TeamControllerApi();
            const response = await teamController.leaveTeam(teamId, { ...injectToken() });
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