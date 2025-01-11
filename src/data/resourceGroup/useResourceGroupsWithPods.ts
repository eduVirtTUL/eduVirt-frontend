import { ResourceGroupControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

export const useResourceGroupsWithPods = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, "withPods"],
    queryFn: async () => {
      const controller = new ResourceGroupControllerApi();
      const response = await controller.getAssignedStatefulResourceGroups({
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { resourceGroupsWithPods: data, isLoading };
};
