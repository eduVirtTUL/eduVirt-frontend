import { CourseControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

export const useCourseResourceGroupPools = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, id],
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.getCourseResourceGroupPools(id, {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { courseResourceGroupPools: data, isLoading };
};
