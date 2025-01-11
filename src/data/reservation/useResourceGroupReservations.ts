import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";

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
      const controller = new ReservationControllerApi();
      const response = await controller.getRgReservationsInGivenCourse(
        course, resourceGroup, start, end,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 204) return [];
      return response.data;
    }
  });

  return {reservations: data, isLoading}
};