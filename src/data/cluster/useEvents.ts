import { useQuery } from "@tanstack/react-query";
import { ClusterControllerApi } from "@/api";
import { keys } from "@/data/keys";

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
      const controller = new ClusterControllerApi();
      const response = await controller.findEventsByClusterId(
        { page, size, sort } , id,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    },
  });

  return { events: data, isLoading };
}