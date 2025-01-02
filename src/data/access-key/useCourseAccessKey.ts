import { AccessKeyControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

export const useCourseAccessKey = (id: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.ACCESS_KEY, id],
        queryFn: async () => {
            const controller = new AccessKeyControllerApi();
            const response = await controller.getKeyForCourse(id);
            
            return response.data;
        },
    });

    return { course: data, isLoading };
}