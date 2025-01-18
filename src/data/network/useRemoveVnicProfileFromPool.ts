import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../keys";
import {privateAxios} from "@/data/privateAxios";
import {useTranslation} from "react-i18next";

export const useRemoveVnicProfileFromPool = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["removeVnicProfileFromPool"],
        mutationFn: async (vnicProfileId: string) => {
            const response = await privateAxios.delete<void>(
                `/resources/vnic-profiles/eduvirt/remove-from-pool/${vnicProfileId}`
            );
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vnic profiles
            queryClient.invalidateQueries({queryKey: [keys.VNIC_PROFILE]});
            toast.success(t("vnicProfiles.pool.remove.success"));
        }
    });

    return {removeVnicProfileFromPool: mutate, removeVnicProfileFromPoolAsync: mutateAsync};
};
