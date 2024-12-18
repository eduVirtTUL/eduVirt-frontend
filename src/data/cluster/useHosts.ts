import {useQuery} from "@tanstack/react-query";
import {keys} from "@/data/keys.ts";
import {ClusterControllerApi} from "@/api";

export const useHosts = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.HOSTS, id],
        queryFn: async () => {
            const controller = new ClusterControllerApi();
            const response = await controller.findCpuInfoByClusterId(id);
            return response.data;
        }
    });

    return {hosts: data, isLoading};
}