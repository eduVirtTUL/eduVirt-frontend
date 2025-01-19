import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useRemoveStudentFromCourse = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeStudentFromCourse } = useMutation({
    mutationFn: async ({ courseId, email }: { courseId: string; email: string }) => {
      const response = await privateAxios.post<void>(
        `/course/${courseId}/remove-student?email=${encodeURIComponent(email)}`
      );
      return response.data;
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