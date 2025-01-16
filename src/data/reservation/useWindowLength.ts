import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useWindowLength = () => {
  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: async() => {
      const response = await privateAxios.get<number>(`/reservations/window-length`);
      return response.data;
    }
  });

  return {length: data, isLoading}
}