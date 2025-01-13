import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CourseControllerApi} from "@/api";
import {toast} from "sonner";
import {keys} from "@/data/keys";

export const useRemoveStudentFromCourse = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: removeStudentFromCourse} = useMutation({
        mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
            const courseController = new CourseControllerApi();
            const response = await courseController.removeStudentFromCourse(courseId, email);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.TEAM]});
            toast.success("Student removed from course");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {removeStudentFromCourse};
};
