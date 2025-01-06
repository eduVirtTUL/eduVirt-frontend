import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { CourseControllerApi } from "@/api";

export const useCourseResourcesAvailability = (
  id: string,
  start: string,
  end: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.COURSE_RESOURCES, id, start, end ],
    queryFn: async () => {
      const controller = new CourseControllerApi();
      const response = await controller.findCourseResourcesAvailability(
        id, start, end,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      return response.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  return { resources: data, isLoading };
}