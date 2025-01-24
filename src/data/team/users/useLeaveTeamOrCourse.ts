import { LeaveTeamDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useLeaveTeamOrCourse = () => {
  const queryClient = useQueryClient();

  const { mutate: leaveTeam } = useMutation({
    mutationFn: async (teamId: string) => {
      const leaveTeamDto: LeaveTeamDto = { teamId };
      const response = await privateAxios.post<void>(
        `/teams/leave`,
        leaveTeamDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("teamDetails.leaveTeam.success"));
    },
  });

  return { leaveTeam };
};