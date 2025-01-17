import { CourseControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {privateAxios} from "@/data/privateAxios";

export const useRemoveTeachersFromCourse = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: removeTeacherFromCourse} = useMutation({
    mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post<void>(
        `/course/${courseId}/remove-teacher`, { params: searchParams }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.COURSE]});
      toast.success("Teacher removed from course");
    },
  });

  return {removeTeacherFromCourse};
}