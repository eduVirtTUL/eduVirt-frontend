import {VnicProfileControllerApi} from "@/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../keys";

export const useAddVnicProfileToPool = () => {
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["addVnicProfileToPool"],
        mutationFn: async (vnicProfileId: string) => {
            const controller = new VnicProfileControllerApi();
            const response = await controller.extendVnicProfilesPool(vnicProfileId);
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vnic profiles
            queryClient.invalidateQueries({queryKey: [keys.VNIC_PROFILE]});
            toast.success("Vnic profile added to pool successfully!");
        },
        onError: () => {
            toast.error("Failed to add vnic profile to pool!");
        },
    });

    return {addVnicProfileToPool: mutate, addVnicProfileToPoolAsync: mutateAsync};
};
