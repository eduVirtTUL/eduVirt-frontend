import { VmControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useVm = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["vm", id],
    queryFn: async () => {
      if (!id) {
        return undefined;
      }

      const controller = new VmControllerApi();
      const response = await controller.getVm(id);
      return response.data;
    },
  });

  return { vm: data, isLoading };
};
