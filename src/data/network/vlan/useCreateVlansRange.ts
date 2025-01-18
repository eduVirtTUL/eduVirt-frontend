import {CreateVlansRangeDto, VlansRangeDto} from "@/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../../keys";
import {privateAxios} from "@/data/privateAxios";
import {useTranslation} from "react-i18next";

export const useCreateVlansRange = () => {
    const {t} = useTranslation();
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["createVlansRange"],
        mutationFn: async (vlansRange: VlansRangeDto) => {
            const response = await privateAxios.post<CreateVlansRangeDto>(
                `/resources/vnic-profiles/vlans-range/add`, vlansRange
            );
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vlans ranges
            queryClient.invalidateQueries({queryKey: [keys.VLANS_RANGE]});
            toast.success(t("vlansRange.add.success"));
        }
    });

    return {createVlansRange: mutate, createVlansRangeAsync: mutateAsync};
};
