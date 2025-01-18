import {VlansRangeDto} from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../../keys";
import {privateAxios} from "@/data/privateAxios";

export const useVlansRanges = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.VLANS_RANGE],
    queryFn: async () => {
      const response = await privateAxios.get<VlansRangeDto[]>(
          `/resources/vnic-profiles/vlans-range`
      );
      return response.data;
    },
  });

  return { vlansRanges: data, isLoading };
};
