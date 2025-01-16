import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoReservationDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

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
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      let response;
      if (active)
        response = await privateAxios.get<PageDtoReservationDto>(
          `/reservations/active/teams/${id}`, { params: searchParams }
        );
      else
        response = await privateAxios.get<PageDtoReservationDto>(
          `/reservations/historic/teams/${id}`, { params: searchParams }
        );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};