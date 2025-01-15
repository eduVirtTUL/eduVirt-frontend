import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CourseControllerApi} from "@/api";
import {toast} from "sonner";
import {keys} from "@/data/keys";

export const useAddStudentToCourse = () => {
    const queryClient = useQueryClient();

    const {mutateAsync: addStudentToCourse} = useMutation({
        mutationFn: async ({courseId, email}: { courseId: string; email: string }) => {
            const courseController = new CourseControllerApi();
            const response = await courseController.addStudentToCourse(courseId, email);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.TEAM]});
            toast.success("Student added to course");
        },
        onError: (error: Error) => {
            console.log(error);
            toast.error(error.message);
        },
    });

    return {addStudentToCourse};
};
