import { keys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";
import { CourseDto } from "@/api";
import { privateAxios } from "@/data/privateAxios";

type UseStudentCoursesParams = {
  page: number;
  size: number;
}

export const useStudentCourses = ({page, size}: UseStudentCoursesParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSES, page, size],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      const response = await privateAxios.get<CourseDto[]>(
        `/course/student`, { params: searchParams }
      );

      if (response.status === 204) return [];
      return response.data ?? [];
    },
  });

  return { courses: data, isLoading };
} ;