import { CourseControllerApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

export const useCourses = (
  pageNumber?: number,
  pageSize?: number,
  search?: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, pageNumber, pageSize, search],
    queryFn: async () => {
      const courseController = new CourseControllerApi();
      const response = await courseController.getCourses(
        pageNumber,
        pageSize,
        search,
        {
          ...injectToken(),
        }
      );
      return response.data;
    },
  });

  return { courses: data, isLoading };
};
