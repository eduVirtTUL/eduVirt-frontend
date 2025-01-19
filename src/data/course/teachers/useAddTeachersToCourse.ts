import { keys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";
import { EmailDto } from "@/api";

export const useAddTeachersToCourse = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addTeacherToCourse } = useMutation({
    mutationFn: async ({ courseId, email }: { courseId: string; email: string }) => {
      const emailDto: EmailDto = { email };
      await privateAxios.post<void>(
        `/course/${courseId}/add-teacher`,
        emailDto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      queryClient.invalidateQueries({ queryKey: [keys.TEACHER] });
      toast.success("Teacher added to course");
    },
  });

  return { addTeacherToCourse };
};