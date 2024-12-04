import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CourseControllerApi} from "@/api";
import {keys} from "../keys";
import {toast} from "sonner";

export const useAddKeyToCourse = () => {
    const queryClient = useQueryClient();

    const {mutate: addKeyToCourse} = useMutation({
        mutationFn: async ({courseId, key}: { courseId: string, key: string }) => {
            const courseController = new CourseControllerApi();
            const response = await courseController.setCourseKey(courseId, {key});
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.COURSE]});
            toast.success("Course key added successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {addKeyToCourse};
};