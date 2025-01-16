import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReservationDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

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
      const response = await privateAxios.post<void>(
        `/reservations/course/${course}/pod/${pod}`, createDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ keys.RESERVATIONS ] });
      queryClient.invalidateQueries({ queryKey: [ keys.COURSE_RESOURCES ] });
      toast.success(t("reservations.createReservation.success"));
    }
  });

  return { createReservation: mutate, createReservationAsync: mutateAsync };
};
