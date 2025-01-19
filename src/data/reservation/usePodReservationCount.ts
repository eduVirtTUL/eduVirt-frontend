import { keys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

type UsePodReservationsCountParams = {
  courseId: string;
  podId: string;
}

export const usePodReservationCount = ({courseId, podId}: UsePodReservationsCountParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.RESERVATIONS, courseId, podId ],
    queryFn: async() => {
      const response = await privateAxios.get<number>(
        `/reservations/course/${courseId}/pods/${podId}/previous/count`
      );
      return response.data;
    }
  });

  return {count: data, isLoading}
};