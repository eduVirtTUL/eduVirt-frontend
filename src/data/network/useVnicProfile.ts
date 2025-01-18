import {VnicProfilePoolMemberDto} from "@/api";
import {useQuery} from "@tanstack/react-query";
import {keys} from "../keys";
import {privateAxios} from "@/data/privateAxios";

export const useVnicProfile = (id: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE, id],
        queryFn: async () => {
            const response = await privateAxios.get<VnicProfilePoolMemberDto>(
                `/resources/vnic-profiles/eduvirt/${id}`
            );
            return response.data;
        },
    });

    return {vnicProfile: data, isLoading};
};