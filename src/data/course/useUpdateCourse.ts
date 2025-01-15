import { UpdateCourseDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { privateAxios } from "../privateAxios";
import { useDialog } from "@/stores/dialogStore";

type UpdateCourse = {
  id: string;
  etag: string;
} & UpdateCourseDto;

export const useUpdateCourse = () => {
  const { t } = useTranslation();
  const { close } = useDialog();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateCourse) => {
      const response = await privateAxios.put(`/course/${id}`, org, {
        headers: {
          "If-Match": etag,
        },
      });

      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      toast.success(t("coursePage.updateAction.success"));
    },
    onError: () => {
      close();
    },
  });

  return { updateCourse: mutate, updateCourseAsync: mutateAsync, isPending };
};
