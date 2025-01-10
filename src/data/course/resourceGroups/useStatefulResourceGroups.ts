import { CourseControllerApi } from "@/api";
import { courseKeys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";

export const useStatefulResourceGroups = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: courseKeys.resourceGroups(id),
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.getCourseStatefulResourceGroups(id);
      return response.data;
    },
  });

  return { statefulResourceGroups: data, isLoading };
};
