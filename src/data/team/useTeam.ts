import { useQuery } from "@tanstack/react-query";
import { TeamWithCourseDto } from "@/api";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

export const useTeam = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [keys.TEAM, id],
    queryFn: async () => {
      const response = await privateAxios.get<TeamWithCourseDto>(
        `/teams/${id}`
      );
      return response.data;
    },
  });

  return { team: data, isLoading };
};
