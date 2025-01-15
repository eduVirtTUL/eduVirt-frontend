import { useQuery } from "@tanstack/react-query";
import { CourseDto } from "@/api";
import { keys } from "../keys";
import { stripEtag } from "@/utils/requestUtils";
import { privateAxios } from "../privateAxios";

export const useCourse = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, id],
    queryFn: async () => {
      const response = await privateAxios.get<CourseDto>(`/course/${id}`);
      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { course: data?.data, etag: data?.etag, isLoading };
};
