import { UpdateTeamDto, TeamWithCourseDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
    
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ id, ...data }: UpdateTeamDto & { id: string }) => {
      const response = await privateAxios.put<TeamWithCourseDto>(
        `/teams/${id}`, data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      queryClient.invalidateQueries({ queryKey: [keys.TEAM, variables.id] });
      toast.success("Team updated successfully");
    },
  });

  return { updateTeam: mutate, updateTeamAsync: mutateAsync };
};