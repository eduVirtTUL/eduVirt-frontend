import { toast } from "sonner";
import { keys } from "../keys";
import { AccessKeyControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateCourseAccessKey = () => {

    const queryClient = useQueryClient();
    const { mutate, mutateAsync } = useMutation({
        mutationKey: ["createCourseAccessKey"],
        mutationFn: async ({ courseId, courseKey }: { courseId: string, courseKey: string }) => {
            const controller = new AccessKeyControllerApi();
            const response = await controller.createCourseKey(courseId, courseKey);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.ACCESS_KEY] });
            toast.success("Course access key created successfully!");
        },
        onError: () => {
            toast.error("Failed to create course access key");
        },
    });
    return { createCourseAccessKey: mutate, createCourseAccessKeyAsync: mutateAsync };
}