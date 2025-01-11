import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { ReservationControllerApi } from "@/api";

type UseReservationsParams = {
    course: string;
    resourceGroupPool: string;
    start: string | null;
    end: string | null;
}

export const useResourceGroupPoolReservations = ({
  course, resourceGroupPool, start, end
}: UseReservationsParams) => {
    const { data, isLoading } = useQuery({
        queryKey: [ keys.RESERVATIONS, course, resourceGroupPool, start, end ],
        queryFn: async() => {
            if (start == null || end == null) return [];
            const controller = new ReservationControllerApi();
            const response = await controller.getRgPoolReservationsInGivenCourse(
                course, resourceGroupPool, start, end,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (response.status === 204) return [];
            return response.data;
        }
    });

    return {reservations: data, isLoading}
};