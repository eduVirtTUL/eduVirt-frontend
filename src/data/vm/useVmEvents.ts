import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { VmControllerApi } from "@/api";
import {injectToken} from "@/utils/requestUtils";

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
      const controller = new VmControllerApi();
      const response = await controller.findEventsForVm(
        id, {page: page, size: size, sort: sort}, { ...injectToken() }
      );

      if (response.status === 204) return [];
      return response.data ?? [];
    },
  });

  return {events: data, isLoading};
};