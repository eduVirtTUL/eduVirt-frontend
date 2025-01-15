import {CourseControllerApi} from "@/api";
import {keys} from "../keys";
import {useQuery} from "@tanstack/react-query";

export const useStudentsInCourse = (courseId: string) => {
    const {data, isLoading} = useQuery({
        queryKey: [keys.USER],
        queryFn: async () => {
            const podController = new CourseControllerApi();
            const response = await podController.getStudentsInSoloCourse(courseId);
            return response.data;
        },
    });

    return {students: data, isLoading};
}