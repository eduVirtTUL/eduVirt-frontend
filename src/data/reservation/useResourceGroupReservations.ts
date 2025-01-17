import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseReservationsParams = {
  course: string;
  resourceGroup: string;
  start: string | null;
  end: string | null;
}

export const useResourceGroupReservations = ({
  course, resourceGroup, start, end
}: UseReservationsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, course, resourceGroup, start, end ],
    queryFn: async() => {
      if (start == null || end == null) return [];

      const searchParams = new URLSearchParams();

      searchParams.append("start", start);
      searchParams.append("end", end);

      const response = await privateAxios.get<ReservationDto[]>(
        `/reservations/courses/${course}/resource-groups/${resourceGroup}/period`, { params: searchParams }
      );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};