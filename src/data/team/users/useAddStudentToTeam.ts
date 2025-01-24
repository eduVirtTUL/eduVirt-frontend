import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useAddStudentToTeam = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addStudentToTeam } = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      const response = await privateAxios.post<void>(
        `/teams/${teamId}/add-student?email=${encodeURIComponent(email)}`
      );
      return response.data;
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      queryClient.invalidateQueries({ queryKey: [keys.TEAM, teamId] });
      toast.success(t("manageTeamUsers.addUser.success"));
    },
  });

  return { addStudentToTeam };
};