import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { privateAxios } from "../privateAxios";

export const useDeleteCourse = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.delete(`/course/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success(t("coursePage.deleteAction.success"));
      nav("/courses");
    },
  });

  return { deleteCourse: mutate, deleteCourseAsync: mutateAsync, isPending };
};
