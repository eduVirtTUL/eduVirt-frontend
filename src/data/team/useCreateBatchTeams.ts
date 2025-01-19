import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { CreateTeamBatchDto, TeamWithKeyDto } from "@/api";

export const useCreateBatchTeams = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createBatchTeams } = useMutation({
    mutationFn: async (data: CreateTeamBatchDto) => {
      const response = await privateAxios.post<TeamWithKeyDto[]>(
        `/teams/batch`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success("Teams created successfully");
    },
  });

  return { createBatchTeams };
};