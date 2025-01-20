import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";
import { ReservationTimeframeModifiersDto } from "@/api";

export const useReservationTimeframeModifiers = () => {
  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: async() => {
      const response = await privateAxios.get<ReservationTimeframeModifiersDto>(`/reservations/timeframe-modifiers`);
      return response.data;
    }
  });

  return {modifiers: data, isLoading}
}