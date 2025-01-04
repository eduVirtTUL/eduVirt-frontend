import {useQuery} from "@tanstack/react-query";
import {keys} from "@/data/keys";
import {ReservationControllerApi} from "@/api";

export const useReservations = (
  id: string,
  start: string | null,
  end: string | null,
) => {
  const {data, isLoading} = useQuery({
    meta: { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } },
    queryKey: [keys.RESERVATIONS, id, start, end],
    queryFn: async() => {
      if (start == null || end == null) return [];
      const controller = new ReservationControllerApi();
      const response = await controller.getReservationsForGivenPeriodForResourceGroup(id, start, end);

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};