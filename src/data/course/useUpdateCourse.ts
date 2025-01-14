import { CourseControllerApi, UpdateCourseDto } from "@/api";
import { injectToken } from "@/utils/requestUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type UpdateCourse = {
  id: string;
  etag: string;
} & UpdateCourseDto;

export const useUpdateCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...org }: UpdateCourse) => {
      const controller = new CourseControllerApi();
      const response = await controller.updateCourse(id, etag ?? "", org, {
        headers: {
          "If-Match": etag,
          ...injectToken().headers,
        },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      toast.success(t("coursePage.updateAction.success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("coursePage.updateAction.error"));
    },
  });

  return { updateCourse: mutate, updateCourseAsync: mutateAsync, isPending };
};
