import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { injectToken } from "@/utils/requestUtils";

type UseReservationsParams = {
  id: string
}

export const useReservation = ({id}: UseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, id ],
    queryFn: async() => {
      const controller = new ReservationControllerApi();
      const response = await controller.getReservationDetails(
        id, { ...injectToken() }
      );

      return response.data;
    }
  });

  return {reservation: data, isLoading}
};