import { AccessKeyControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

export const useTeamAccessKey = (id: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.ACCESS_KEY, id],
        queryFn: async () => {
            const controller = new AccessKeyControllerApi();
            const response = await controller.getKeyForTeam(id);
            
            return response.data;
        },
    });

    return { course: data, isLoading };
}