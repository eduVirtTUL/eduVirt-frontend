import { CreateTeamDto, TeamControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync } = useMutation({
        mutationKey: ["createTeam"],
        mutationFn: async (team: CreateTeamDto) => {
            const controller = new TeamControllerApi();
            const response = await controller.createTeam(team);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
            toast.success("Team created successfully!");
        },
        onError: () => {
            toast.error("Failed to create team");
        },
    });

    return { createTeam: mutate, createTeamAsync: mutateAsync };
};
