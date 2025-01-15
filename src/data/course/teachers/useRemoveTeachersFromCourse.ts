import { CourseControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveTeachersFromCourse = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: removeTeacherFromCourse} = useMutation({
        mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
            const courseController = new CourseControllerApi();
            const response = await courseController.removeTeacherFromCourse(courseId, email);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.COURSE]});
            toast.success("Teacher removed from course");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {removeTeacherFromCourse};
}