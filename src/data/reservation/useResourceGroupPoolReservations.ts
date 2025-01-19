import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseReservationsParams = {
    course: string;
    resourceGroupPool: string;
    start: string | null;
    end: string | null;
    own: boolean;
}

export const useResourceGroupPoolReservations = ({
  course, resourceGroupPool, start, end, own
}: UseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, course, resourceGroupPool, start, end, own ],
    queryFn: async() => {
      if (start == null || end == null) return [];

      const searchParams = new URLSearchParams();

      searchParams.append("start", start);
      searchParams.append("end", end);

      let response;
      if (own)
        response = await privateAxios.get<ReservationDto[]>(
          `/reservations/courses/${course}/resource-group-pools/${resourceGroupPool}/period/own`, { params: searchParams }
        );
      else
        response = await privateAxios.get<ReservationDto[]>(
          `/reservations/courses/${course}/resource-group-pools/${resourceGroupPool}/period`, { params: searchParams }
        );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};