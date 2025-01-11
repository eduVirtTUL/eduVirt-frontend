import { PodStatefulControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

export const useStatefulPodsForTeam = (teamId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.POD],
        queryFn: async () => {
            const podController = new PodStatefulControllerApi();
            const response = await podController.getStatefulPodsByTeam(teamId);
            return response.data;
        },
    });

    return { statefulPods: data, isLoading };
}