import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../../keys";
import {privateAxios} from "@/data/privateAxios";
import {useTranslation} from "react-i18next";

export const useRemoveVlansRange = () => {
    const {t} = useTranslation();
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["removeVlansRange"],
        mutationFn: async (vlansRangeId: string) => {
            const response = await privateAxios.delete<void>(
                `/resources/vnic-profiles/vlans-range/${vlansRangeId}/remove`
            );
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vlans ranges
            queryClient.invalidateQueries({queryKey: [keys.VLANS_RANGE]});
            toast.success(t("vlansRange.actions.remove.success"));
        }
    });

    return {removeVlansRange: mutate, removeVlansRangeAsync: mutateAsync};
};
