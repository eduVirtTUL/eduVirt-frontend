import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

export const useFinishReservation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "finishReservation" ],
    mutationFn: async (id: string) => {
      const response = await privateAxios.post<void>(`/reservations/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ keys.RESERVATIONS ] });
      queryClient.invalidateQueries({ queryKey: [ keys.COURSE_RESOURCES ] });
      toast.success(t("reservations.finishReservation.success"));
    }
  });

  return { finishReservation: mutate, finishReservationAsync: mutateAsync };
};