import {useQuery} from "@tanstack/react-query";
import {ClusterControllerApi} from "@/api";
import {keys} from "@/data/keys.ts";

export const useCluster = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.CLUSTER, id],
        queryFn: async () => {
            const controller = new ClusterControllerApi();
            const response = await controller.findClusterById(id);

            return response.data;
        }
    });

    return {cluster: data, isLoading};
};