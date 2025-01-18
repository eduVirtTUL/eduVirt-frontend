import { toast } from "sonner";
import { keys } from "../keys";
import { CourseAccessKeyDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

export const useCreateCourseAccessKey = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createCourseAccessKey"],
    mutationFn: async ({ courseId, courseKey }: { courseId: string, courseKey: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("courseKey", courseKey);

      const response = await privateAxios.post<CourseAccessKeyDto>(
        `/access-keys/course/${courseId}?${searchParams.toString()}`, 
        {}
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.ACCESS_KEY] });
      toast.success(t("createCourseKey.success"));
    },
  });
  return { createCourseAccessKey: mutate, createCourseAccessKeyAsync: mutateAsync };
}