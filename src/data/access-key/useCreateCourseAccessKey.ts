import { toast } from "sonner";
import { keys } from "../keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";
import { CreateCourseKeyDto, CourseAccessKeyDto } from "@/api";

export const useCreateCourseAccessKey = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createCourseAccessKey"],
    mutationFn: async ({ courseId, courseKey }: { courseId: string, courseKey: string }) => {
      const createDto: CreateCourseKeyDto = {
        keyValue: courseKey
      };

      const response = await privateAxios.post<CourseAccessKeyDto>(
        `/access-keys/course/${courseId}`,
        createDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.ACCESS_KEY] });
      toast.success(t("createCourseKey.success"));
    },
  });

  return { createCourseAccessKey: mutate, createCourseAccessKeyAsync: mutateAsync };
};