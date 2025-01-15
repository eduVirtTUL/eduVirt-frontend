import { CourseDto, CreateCourseDto } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { useTranslation } from "react-i18next";
import { privateAxios } from "../privateAxios";

export const useCreateCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (course: CreateCourseDto) => {
      const response = await privateAxios.post<CourseDto>("/course", course);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      toast.success(t("createCourseModal.success"));
    },
  });

  return { createCourse: mutate, createCourseAsync: mutateAsync };
};
