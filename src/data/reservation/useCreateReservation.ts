import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReservationDto, ReservationControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { injectToken } from "@/utils/requestUtils";
import {AxiosError} from "axios";

type UseCreateReservation = {
  course: string;
  pod: string;
}

export const useCreateReservation = ({
  course, pod
}: UseCreateReservation) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "createReservation" ],
    mutationFn: async (createDto: CreateReservationDto) => {
      const controller = new ReservationControllerApi();
      const response = await controller.createNewReservationForPod(
        course, pod, createDto, { ...injectToken() }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ keys.RESERVATIONS ] });
      queryClient.invalidateQueries({ queryKey: [ keys.COURSE_RESOURCES ] });
      toast.success(t("reservations.createReservation.success"));
    },
    onError: (error: AxiosError) => {
      console.log(error)
      toast.error(t("reservations.createReservation.error"));
    },
  });

  return { createReservation: mutate, createReservationAsync: mutateAsync };
};
