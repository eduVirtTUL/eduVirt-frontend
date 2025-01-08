import { CourseControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";

export const useCourses = (pageNumber?: number, pageSize?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, pageNumber, pageSize],
    queryFn: async () => {
      const courseController = new CourseControllerApi();
      const response = await courseController.getCourses(pageNumber, pageSize);
      return response.data;
    },
  });

  return { courses: data, isLoading };
};
