import { keys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";
import { UserDto } from "@/api";

export const useGetTeachersForCourse = (courseId: string) => {
  const {data, isLoading} = useQuery({
    queryKey: [keys.TEACHER],
    queryFn: async () => {
      const response = await privateAxios.get<UserDto[]>(
        `/course/${courseId}/teachers`
      );
      return response.data;
    },
  });

  return {teachers: data, isLoading};
}