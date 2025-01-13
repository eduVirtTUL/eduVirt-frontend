import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";

type UseTeamReservationsParams = {
  id: string,
  active: boolean
  page: number,
  size: number,
}

export const useTeamReservations = ({
  id, active, page, size
}: UseTeamReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, id, page, size ],
    queryFn: async() => {
      const controller = new ReservationControllerApi();
      let response;

      if (active)
        response = await controller.getActiveReservationsForTeam(
          id, page, size, { ...injectToken() }
        );
      else
        response = await controller.getHistoricReservationsForTeam(
          id, page, size, { ...injectToken() }
        );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};