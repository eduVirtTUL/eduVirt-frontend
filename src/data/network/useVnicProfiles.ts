import { VnicProfileDto} from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

export const useVnicProfiles = () => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE],
        queryFn: async () => {
            const response = await privateAxios.get<VnicProfileDto[]>(
                `/resources/vnic-profiles`
            );
            return response.data;
        },
    });

    return {vnicProfiles: data, isLoading};
};