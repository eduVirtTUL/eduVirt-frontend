import { useQuery } from "@tanstack/react-query";
import { CourseControllerApi } from "@/api";
import { keys } from "../keys";
import { injectToken, stripEtag } from "@/utils/requestUtils";

export const useCourse = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.COURSE, id],
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.getCourse(id, { ...injectToken() });
      // const response = await axios.get<CourseDto>(
      //   `http://localhost:8080/course/${id}`,
      //   {
      //     ...injectToken(),
      //   }
      // );

      const etag = response.headers["etag"] as string;

      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { course: data?.data, etag: data?.etag, isLoading };
};
