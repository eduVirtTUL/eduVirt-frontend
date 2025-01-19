import { keys } from "@/data/keys";
import { ReservationDetailsDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

type UsePodReservationsParams = {
  courseId: string;
  podId: string;
}

export const usePodReservation = ({courseId, podId}: UsePodReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, courseId, podId ],
    queryFn: async() => {
      const response = await privateAxios.get<ReservationDetailsDto>(
        `/reservations/course/${courseId}/pods/${podId}/previous`
      );
      return response.data;
    }
  });

  return {reservation: data, isLoading}
};