import { PageDtoCourseDto } from "./../../api/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";

export const useCourses = (
  pageNumber?: number,
  pageSize?: number,
  search?: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, pageNumber, pageSize, search],
    queryFn: async () => {
      const response = await privateAxios.get<PageDtoCourseDto>("/course", {
        params: { page: pageNumber, size: pageSize, search },
      });
      return response.data;
    },
  });

  return { courses: data, isLoading };
};
