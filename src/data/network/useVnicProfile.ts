import {VnicProfileControllerApi} from "@/api";
import {useQuery} from "@tanstack/react-query";
import {keys} from "../keys";

export const useVnicProfile = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE, id],
        queryFn: async () => {
            const vnicProfileController = new VnicProfileControllerApi();
            const response = await vnicProfileController.getVnicProfileFromPool(id);
            return response.data;
        },
    });

    return {vnicProfile: data, isLoading};
};