import { VnicProfileDto} from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

export const useVnicProfilesDetails = () => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE_DETAIL],
        queryFn: async () => {
            const response = await privateAxios.get<VnicProfileDto[]>(
                `/resources/vnic-profiles/eduvirt`
            );
            return response.data;
        },
    });

    return {vnicProfilesDetails: data, isLoading};
};