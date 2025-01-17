import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

export const useAddStudentToCourse = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: addStudentToCourse} = useMutation({
    mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post<void>(
        `/course/${courseId}/add-student`, { params: searchParams }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.TEAM]});
      toast.success("Student added to course");
    },
  });

  return {addStudentToCourse};
};
