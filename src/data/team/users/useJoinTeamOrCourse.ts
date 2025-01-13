import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamControllerApi } from "@/api";
import { toast } from "sonner";
import {useTranslation} from "react-i18next";
import { keys } from "@/data/keys";

export const useJoinTeamOrCourse = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { mutate: joinTeam } = useMutation({
        mutationFn: async (key: string) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const teamController = new TeamControllerApi();
            const response = await teamController.joinUsingKey(key, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
            toast.success(t("joinTeam.success"));
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return { joinTeam };
};