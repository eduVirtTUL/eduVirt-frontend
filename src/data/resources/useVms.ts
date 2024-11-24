import { VmControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useVms = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["vm"],
    queryFn: async () => {
      const controller = new VmControllerApi();
      const response = await controller.getVms();
      return response.data;
    },
  });

  return { vms: data, isLoading };
};
