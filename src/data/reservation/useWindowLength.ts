import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";
import { keys } from "@/data/keys";

export const useWindowLength = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.TIME_WINDOW ],
    queryFn: async() => {
      const response = await privateAxios.get<number>(`/reservations/window-length`);
      return response.data;
    }
  });

  return {length: data, isLoading}
}