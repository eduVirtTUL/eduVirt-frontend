import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoReservationDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseCourseOngoingReservationsParams = {
    id: string;
    page: number;
    size: number;
    sort: string[];
}

export const useCourseOngoingReservations =
    ({id, page, size, sort}: UseCourseOngoingReservationsParams) => {
        const { data, isLoading } = useQuery({
            queryKey: [ keys.ONGOING_RESERVATIONS, id, page, size, sort ],
            queryFn: async() => {
                const searchParams = new URLSearchParams();

                searchParams.append("page", page.toString());
                searchParams.append("size", size.toString());
                sort.forEach((sortElement) => (searchParams.append("sort", sortElement)));

                const response = await privateAxios.get<PageDtoReservationDto>(
                    `/course/${id}/reservations`, { params: searchParams }
                );

                if (response.status === 204) return [];
                return response.data.items ?? [];
            }
        });

        return {reservations: data, isLoading}
    }