import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateReservationDto, ReservationControllerApi} from "@/api";
import {keys} from "@/data/keys.ts";
import {toast} from "sonner";

export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["createReservation"],
        mutationFn: async (createDto: CreateReservationDto) => {
            const controller = new ReservationControllerApi();
            const response = await controller.createNewReservation(createDto);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.RESERVATIONS]});
            toast.success("New reservation created successfully!");
        },
        onError: () => {
            toast.error("Failed to create reservation for given resource group.");
        },
    });

    return {createReservation: mutate, createReservationAsync: mutateAsync };
}