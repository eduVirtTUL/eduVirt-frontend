import { UserDto } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useStudentsInCourse = (courseId: string) => {
  const {data, isLoading} = useQuery({
    queryKey: [keys.USER],
    queryFn: async () => {
      const response = await privateAxios.get<UserDto[]>(
        `/course/${courseId}/students`
      );
      return response.data;
    },
  });

  return {students: data, isLoading};
}