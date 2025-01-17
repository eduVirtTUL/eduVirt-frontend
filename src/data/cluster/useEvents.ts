import { useQuery } from "@tanstack/react-query";
import { EventGeneralDto } from "@/api";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

type UseEventsParams = {
  id: string,
  page: number,
  size: number,
  sort: string[]
}

export const useEvents = ({ id, page, size, sort}: UseEventsParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.EVENTS, id, page, size, sort ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      sort.forEach((sortElement) => (
          searchParams.append("sort", sortElement)
      ));

      const response = await privateAxios.get<EventGeneralDto[]>(
        `/clusters/${id}/events`, { params: searchParams }
      );
      return response.data;
    },
  });

  return { events: data, isLoading };
}