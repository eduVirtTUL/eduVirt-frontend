import { CourseControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useDeleteCourse = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new CourseControllerApi();
      await controller.deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success(t("coursePage.deleteAction.success"));
      nav("/courses");
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("coursePage.deleteAction.error"));
    },
  });

  return { deleteCourse: mutate, deleteCourseAsync: mutateAsync, isPending };
};
