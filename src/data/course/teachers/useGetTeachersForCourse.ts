import { CourseControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { useQuery } from "@tanstack/react-query";

export const useGetTeachersForCourse = (courseId: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.TEACHER],
        queryFn: async () => {
            const courseController = new CourseControllerApi();
            const response = await courseController.getTeachersForCourse(courseId);
            return response.data;
        },
    });

    return {teachers: data, isLoading};
}