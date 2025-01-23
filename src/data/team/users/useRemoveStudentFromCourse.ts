import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { EmailDto } from "@/api";
import { t } from "i18next";

export const useRemoveStudentFromCourse = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeStudentFromCourse } = useMutation({
    mutationFn: async ({ courseId, email }: { courseId: string; email: string }) => {
      const emailDto: EmailDto = { email };
      await privateAxios.post<void>(
        `/course/${courseId}/remove-student`,
        emailDto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      queryClient.invalidateQueries({ queryKey: [keys.USER] });
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      toast.success(t("coursePageB.courseTeamsPage.removeStudentFromCourseSuccess"));
    },
  });

  return { removeStudentFromCourse };
};