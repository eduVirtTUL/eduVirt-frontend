import { CreateCourseDto } from "@/api";
import { CourseControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";
import { useTranslation } from "react-i18next";

export const useCreateCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (course: CreateCourseDto) => {
      const controller = new CourseControllerApi();
      const response = await controller.createCourse(course, { ...injectToken() });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the courses query to refetch the data
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      toast.success(t("createCourseModal.success"));
    },
    onError: () => {
      toast.error(t("createCourseModal.error"));
    },
  });

  return { createCourse: mutate, createCourseAsync: mutateAsync };
};
