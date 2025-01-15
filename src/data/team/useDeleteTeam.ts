import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TeamControllerApi} from "@/api";
import {toast} from "sonner";
import {keys} from "@/data/keys";

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: deleteTeam} = useMutation({
        mutationFn: async (teamId: string) => {
            const courseController = new TeamControllerApi();
            const response = await courseController.deleteTeam(teamId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.TEAM]});
            toast.success("Team successfully deleted");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {deleteTeam};
};
