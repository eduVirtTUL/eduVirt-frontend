import {VlansRangeControllerApi, VlansRangeDto} from "@/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {keys} from "../keys";

export const useCreateVlansRange = () => {
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["createVlansRange"],
        mutationFn: async (vlansRange: VlansRangeDto) => {
            const controller = new VlansRangeControllerApi();
            const response = await controller.addVlansRange(vlansRange);
            return response.data;
        },
        onSuccess: () => {
            // Force to refetch vlans ranges
            queryClient.invalidateQueries({queryKey: [keys.VLANS_RANGE]});
            toast.success("VLANs range created successfully!");
        },
        onError: () => {
            toast.error("Failed to create VLANs range!");
        },
    });

    return {createVlansRange: mutate, createVlansRangeAsync: mutateAsync};
};
