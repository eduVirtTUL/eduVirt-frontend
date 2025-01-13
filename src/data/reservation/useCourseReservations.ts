import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

type UseCourseReservationsParams = {
  id: string,
  active: boolean
  page: number,
  size: number,
}

export const useCourseReservations = ({
  id, active, page, size
}: UseCourseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, id, active, page, size ],
    queryFn: async() => {
      const controller = new ReservationControllerApi();
      let response;

      if (active)
        response = await controller.getActiveReservations(
          id, page, size, { ...injectToken() }
        );
      else
        response = await controller.getHistoricReservations(
          id, page, size, { ...injectToken() }
        );

      if (response.status === 204) return [];
      return response.data.items ?? [];
    }
  });

  return {reservations: data, isLoading}
};