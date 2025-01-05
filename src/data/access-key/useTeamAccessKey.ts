import { AccessKeyControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

interface UseTeamAccessKeyOptions {
    enabled?: boolean
}

export const useTeamAccessKey = (id: string, options: UseTeamAccessKeyOptions = {}) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.ACCESS_KEY, id],
        queryFn: async () => {
            const controller = new AccessKeyControllerApi();
            const response = await controller.getKeyForTeam(id);
            return response.data;
        },
        enabled: options.enabled
    });

    return { team: data, isLoading };
}