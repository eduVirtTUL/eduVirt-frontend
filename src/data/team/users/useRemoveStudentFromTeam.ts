import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TeamControllerApi} from "@/api";
import {toast} from "sonner";
import {keys} from "@/data/keys";

export const useRemoveStudentFromTeam = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: removeStudentFromTeam} = useMutation({
        mutationFn: async ({teamId, email}: { teamId: string; email: string }) => {

            const teamController = new TeamControllerApi();
            const response = await teamController.removeStudentFromTeam(teamId, email);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.TEAM]});
            toast.success("Student removed from team");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {removeStudentFromTeam};
};
