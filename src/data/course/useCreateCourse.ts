import { CreateCourseDto } from "../../api/api";
import { CourseControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { injectToken } from "@/utils/requestUtils";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (course: CreateCourseDto) => {
      const controller = new CourseControllerApi();
      const response = await controller.addCourse(course, { ...injectToken() });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the courses query to refetch the data
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      toast.success("Course created successfully!");
    },
    onError: () => {
      toast.error("Failed to create course");
    },
  });

  return { createCourse: mutate, createCourseAsync: mutateAsync };
};
