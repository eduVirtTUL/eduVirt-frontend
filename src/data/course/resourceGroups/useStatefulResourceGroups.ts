import { CourseControllerApi } from "@/api";
import { courseKeys } from "@/data/keys";
import { injectToken } from "@/utils/requestUtils";
import { useQuery } from "@tanstack/react-query";

export const useStatefulResourceGroups = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.resourceGroups(id),
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.getCourseStatefulResourceGroups(id, {
        ...injectToken(),
      });
      return response.data;
    },
  });

  return { statefulResourceGroups: data, isLoading };
};
