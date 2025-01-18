import {VnicProfilePoolMemberDto} from "@/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../keys";
import {privateAxios} from "@/data/privateAxios";
import {useTranslation} from "react-i18next";

export const useAddVnicProfileToPool = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["addVnicProfileToPool"],
        mutationFn: async (vnicProfileId: string) => {
            const response = await privateAxios.post<VnicProfilePoolMemberDto>(
                `/resources/vnic-profiles/eduvirt/add-to-pool/${vnicProfileId}`
            );
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vnic profiles
            queryClient.invalidateQueries({queryKey: [keys.VNIC_PROFILE]});
            toast.success(t("vnicProfiles.pool.add.success"));
        }
    });

    return {addVnicProfileToPool: mutate, addVnicProfileToPoolAsync: mutateAsync};
};
