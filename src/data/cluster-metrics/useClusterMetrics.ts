import {useQuery} from "@tanstack/react-query";
import {ClusterMetricControllerApi} from "@/api";
import {keys} from "@/data/keys.ts";

export const useClusterMetrics = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.CLUSTER_METRIC_VALUES, id],
        queryFn: async() => {
            const controller = new ClusterMetricControllerApi();
            const response = await controller.getAllMetricValues(id);

            return response.data;
        }
    });

    return {metrics: data, isLoading};
}