import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { EventGeneralDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseVmEventsParam = {
  id: string,
  page: number,
  size: number,
  sort: Array<string>
}

export const useVmEvents = ({
  id, page, size, sort
}: UseVmEventsParam) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.VM_EVENTS, id, page, size, sort ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      sort.forEach((sortElement) => (
          searchParams.append("sort", sortElement)
      ));

      const response = await privateAxios.get<EventGeneralDto[]>(
        `/resource/vm/${id}/events`, { params: searchParams }
      );

      if (response.status === 204) return [];
      return response.data ?? [];
    },
  });

  return {events: data, isLoading};
};