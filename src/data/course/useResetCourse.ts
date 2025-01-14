import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { keys } from "../keys";
import { CustomAxiosError, privateAxios } from "../privateAxios";

export const useResetCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.post(`/course/${id}/reset`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("coursePage.resetAction.success"));
    },
    onError: (error: CustomAxiosError) => {
      console.error(error);
      toast.error(t("coursePage.resetAction.error"));
    },
  });

  return { resetCourse: mutate, resetCourseAsync: mutateAsync, isPending };
};
