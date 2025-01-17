import { CourseControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddTeachersToCourse = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: addTeacherToCourse} = useMutation({
        mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
            const courseController = new CourseControllerApi();
            const response = await courseController.addTeacherToCourse(courseId, email);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.COURSE]});
            queryClient.invalidateQueries({queryKey: [keys.TEACHER]});
            toast.success("Teacher added to course");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message);
        },
    });

    return {addTeacherToCourse};
    };