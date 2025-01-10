import { PodStatelessControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

export const useStatelessPodsForTeam = (teamId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.STATELESS_POD],
        queryFn: async () => {
            const podController = new PodStatelessControllerApi();
            const response = await podController.getStatelessPodsByTeam(teamId);
            return response.data;
        },
    });

    return { pods: data, isLoading };
}