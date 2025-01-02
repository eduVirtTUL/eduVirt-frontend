import { PodControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

export const useStatefulPodsForTeam = (teamId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.POD],
        queryFn: async () => {
            const podController = new PodControllerApi();
            const response = await podController.getStatefulPodsByTeam(teamId);
            return response.data;
        },
    });

    return { pods: data, isLoading };
}