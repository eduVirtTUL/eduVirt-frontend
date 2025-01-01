import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReservationDto, ReservationControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import {useTranslation} from "react-i18next";

export const useCreateReservation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createReservation"],
    mutationFn: async (createDto: CreateReservationDto) => {
      const controller = new ReservationControllerApi();
      const response = await controller.createNewReservation(createDto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.RESERVATIONS] });
      toast.success(t("reservations.createReservation.success"));
    },
    onError: () => {
      toast.error(t("reservations.createReservation.error"));
    },
  });

  return { createReservation: mutate, createReservationAsync: mutateAsync };
};
