import {VlansRangeControllerApi} from "@/api";
import {useQuery} from "@tanstack/react-query";
import {keys} from "../keys";

export const useVlansRanges = () => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VLANS_RANGE],
        queryFn: async () => {
            const controller = new VlansRangeControllerApi();
            const response = await controller.getVlansRanges();
            return response.data;
        },
    });

    return {vlansRanges: data, isLoading};
};