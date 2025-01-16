import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

export const useRemoveStudentFromCourse = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: removeStudentFromCourse} = useMutation({
    mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post<void>(
        `/course/${courseId}/remove-student`, { params: searchParams }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.TEAM]});
      toast.success("Student removed from course");
    },
  });

  return {removeStudentFromCourse};
};
