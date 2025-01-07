import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

type UseReservationsParams = {
  id: string
}

export const useReservation = ({id}: UseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, id ],
    queryFn: async() => {
      const controller = new ReservationControllerApi();
      const response = await controller.getReservationDetails(
        id, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      return response.data;
    }
  });

  return {reservation: data, isLoading}
};