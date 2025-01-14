import { ReservationControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { injectToken } from "@/utils/requestUtils";

export const useWindowLength = () => {
  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: async() => {
      const controller = new ReservationControllerApi();
      const response = await controller.getWindowLength({ ...injectToken() });
      return response.data;
    }
  });

  return {length: data, isLoading}
}