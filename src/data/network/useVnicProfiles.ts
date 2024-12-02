import {VnicProfileControllerApi} from "@/api";
import {useQuery} from "@tanstack/react-query";
import {keys} from "../keys";

export const useVnicProfiles = () => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE],
        queryFn: async () => {
            const vnicProfileController = new VnicProfileControllerApi();
            const response = await vnicProfileController.getSynchronizedVnicProfiles();
            return response.data;
        },
    });

    return {vnicProfiles: data, isLoading};
};