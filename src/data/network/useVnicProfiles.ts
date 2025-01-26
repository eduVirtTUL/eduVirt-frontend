import { VnicProfileDto} from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

type UseVnicProfilesParams = {
  page: number,
  size: number,
  sort: string[]
}

export const useVnicProfiles = ({ page, size, sort}: UseVnicProfilesParams) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.VNIC_PROFILE, page, size, sort],
        queryFn: async () => {
            const searchParams = new URLSearchParams();

            searchParams.append("page", page.toString());
            searchParams.append("size", size.toString());

            sort.forEach((sortElement) => (
                searchParams.append("sort", sortElement)
            ));

            const response = await privateAxios.get<VnicProfileDto[]>(
                `/resources/vnic-profiles`, { params: searchParams }
            );
            return response.data;
        },
    });

    return {vnicProfiles: data, isLoading};
};