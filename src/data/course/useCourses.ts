import { CourseControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";

export const useCourses = () => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE],
    queryFn: async () => {
      const courseController = new CourseControllerApi();
      const response = await courseController.getCourses();
      return response.data;
    },
  });

  return { courses: data, isLoading };
};
