import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { PageDtoReservationDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

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
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      let response;
      if (active)
        response = await privateAxios.get<PageDtoReservationDto>(
          `/reservations/active/courses/${id}`, { params: searchParams }
        );
      else
        response = await privateAxios.get<PageDtoReservationDto>(
          `/reservations/historic/courses/${id}`, { params: searchParams }
        );


      if (response.status === 204) return [];
      return response.data.items ?? [];
    }
  });

  return {reservations: data, isLoading}
};