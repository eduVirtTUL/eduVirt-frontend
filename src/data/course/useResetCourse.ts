import { CourseControllerApi } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { keys } from "../keys";

export const useResetCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new CourseControllerApi();
      await controller.resetCourse(id, {
        ...injectToken(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("coursePage.resetAction.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("coursePage.resetAction.error"));
    },
  });

  return { resetCourse: mutate, resetCourseAsync: mutateAsync, isPending };
};
