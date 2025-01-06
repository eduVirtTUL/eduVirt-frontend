import { AccessKeyControllerApi } from "@/api";
import { keys } from "../keys";
import { useQuery } from "@tanstack/react-query";

interface UseCourseAccessKeyOptions {
    enabled?: boolean
  }

  export const useCourseAccessKey = (id: string, options: UseCourseAccessKeyOptions = {}) => {
    const { data, isLoading } = useQuery({
        queryKey: [keys.ACCESS_KEY, id],
        queryFn: async () => {
            const controller = new AccessKeyControllerApi();
            const response = await controller.getKeyForCourse(id);
            
            return response.data;
        },
        enabled: options.enabled,
    });

    return { course: data, isLoading };
}