import { CreateTeamDto, TeamWithCourseDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: async (team: CreateTeamDto) => {
      const response = await privateAxios.post<TeamWithCourseDto>(
        `/teams`, team
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("createTeam.success"));
    },
  });

  return { createTeam: mutate, createTeamAsync: mutateAsync };
};
