import { keys } from "@/data/keys";
import { ReservationDetailsDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

type UseReservationsParams = {
  id: string
}

export const useReservation = ({id}: UseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, id ],
    queryFn: async() => {
      const response = await privateAxios.get<ReservationDetailsDto>(`/reservations/${id}`);
      return response.data;
    }
  });

  return {reservation: data, isLoading}
};