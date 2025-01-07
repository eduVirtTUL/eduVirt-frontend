import { keys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";
import {CourseControllerApi} from "@/api";

type UseStudentCoursesParams = {
  page: number;
  size: number;
}

export const useStudentCourses = ({page, size}: UseStudentCoursesParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSES, page, size],
    queryFn: async () => {
      const courseController = new CourseControllerApi();
      const response = await courseController.getCoursesForStudent(
        { page: page, size: size, sort: undefined},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 204) return [];
      return response.data ?? [];
    },
  });

  return { courses: data, isLoading };
} ;