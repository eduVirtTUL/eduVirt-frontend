import { keys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";

export const useAddTeachersToCourse = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: addTeacherToCourse} = useMutation({
    mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post<void>(
        `/course/${courseId}/add-teacher`, { params: searchParams }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.COURSE]});
      toast.success("Teacher added to course");
    }
  });

  return {addTeacherToCourse};
};