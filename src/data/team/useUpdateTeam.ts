import { UpdateTeamDto, TeamControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";

export const useUpdateTeam = () => {
    const queryClient = useQueryClient();
    
    const { mutate, mutateAsync } = useMutation({
        mutationFn: async ({ id, ...data }: UpdateTeamDto & { id: string }) => {
            const controller = new TeamControllerApi();
            const response = await controller.updateTeam(id, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
            queryClient.invalidateQueries({ queryKey: [keys.TEAM, variables.id] });
            toast.success("Team updated successfully");
        },
        onError: () => {
            toast.error("Failed to update team");
        }
    });

    return { updateTeam: mutate, updateTeamAsync: mutateAsync };
};