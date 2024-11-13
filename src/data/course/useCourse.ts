import { useQuery } from "@tanstack/react-query";
import { CourseControllerApi } from "@/api";
import { keys } from "../keys";
export const useCourse = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, id],
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.getCourse(id);

      return response.data;
    },
  });

  return { course: data, isLoading };
};
