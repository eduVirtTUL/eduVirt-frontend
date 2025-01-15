import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";
import { useDialog } from "@/stores/dialogStore";

export const useResetCourse = () => {
  const { t } = useTranslation();
  const { close } = useDialog();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await privateAxios.post(`/course/${id}/reset`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("coursePage.resetAction.success"));
    },
    onError: () => {
      close();
    },
  });

  return { resetCourse: mutate, resetCourseAsync: mutateAsync, isPending };
};
