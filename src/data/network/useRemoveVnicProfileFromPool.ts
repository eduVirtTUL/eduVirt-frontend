import {VnicProfileControllerApi} from "@/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../keys";

export const useRemoveVnicProfileFromPool = () => {
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["removeVnicProfileFromPool"],
        mutationFn: async (vnicProfileId: string) => {
            const controller = new VnicProfileControllerApi();
            const response = await controller.reduceVnicProfilesPool(vnicProfileId);
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vnic profiles
            queryClient.invalidateQueries({queryKey: [keys.VNIC_PROFILE]});
            toast.success("Vnic profile removed from pool successfully!");
        },
        onError: () => {
            toast.error("Failed to remove vnic profile from pool!");
        },
    });

    return {removeVnicProfileFromPool: mutate, removeVnicProfileFromPoolAsync: mutateAsync};
};
