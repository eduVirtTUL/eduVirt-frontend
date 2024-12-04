import {useQuery} from "@tanstack/react-query";
import {keys} from "@/data/keys.ts";
import {ClusterControllerApi} from "@/api";

export const useClusterDetails = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.CLUSTER],
        queryFn: async() => {
            const controller = new ClusterControllerApi();
            const response = await controller.findClusterById(id);
            return response.data;
        }
    });

    return {cluster: data, isLoading};
}