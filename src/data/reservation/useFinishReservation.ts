import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReservationControllerApi } from "@/api";
import { toast } from "sonner";
import { keys } from "@/data/keys";

export const useFinishReservation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "finishReservation" ],
    mutationFn: async (id: string) => {
      const controller = new ReservationControllerApi();
      const response = await controller.finishReservation(
        id, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.RESERVATIONS] });
      toast.success(t("reservations.finishReservation.success"));
    },
    onError: () => {
      toast.error(t("reservations.finishReservation.error"));
    },
  });

  return { finishReservation: mutate, finishReservationAsync: mutateAsync };
};