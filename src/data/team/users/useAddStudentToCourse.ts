import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { EmailDto } from "@/api";

export const useAddStudentToCourse = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addStudentToCourse } = useMutation({
    mutationFn: async ({ courseId, email }: { courseId: string; email: string }) => {
      const emailDto: EmailDto = { email };
      await privateAxios.post<void>(
        `/course/${courseId}/add-student`,
        emailDto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success("Dodano studenta do przedmiotu");
    },
  });

  return { addStudentToCourse };
};