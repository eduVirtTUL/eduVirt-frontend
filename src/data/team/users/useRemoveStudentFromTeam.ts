import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";
import { EmailDto } from "@/api";

export const useRemoveStudentFromTeam = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeStudentFromTeam } = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      const emailDto: EmailDto = { email };
      const response = await privateAxios.post<void>(
        `/teams/${teamId}/remove-student`,
        emailDto
      );
      return response.data;
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      queryClient.invalidateQueries({ queryKey: [keys.TEAM, teamId] });
      queryClient.invalidateQueries({ queryKey: [keys.USER] });
      queryClient.invalidateQueries({ queryKey: [keys.COURSE] });
      toast.success(t("coursePageB.courseTeamsPage.removeStudentFromTeamSuccess"));
    },
  });

  return { removeStudentFromTeam };
};