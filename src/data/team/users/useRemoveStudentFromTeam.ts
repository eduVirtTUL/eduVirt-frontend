import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useRemoveStudentFromTeam = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: removeStudentFromTeam} = useMutation({
    mutationFn: async ({teamId, email}: { teamId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post<void>(
        `/teams/${teamId}/remove-student`, { params: searchParams }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.TEAM]});
      queryClient.invalidateQueries({queryKey: [keys.USER]});
      queryClient.invalidateQueries({queryKey: [keys.COURSE]});
      toast.success(t("coursePageB.courseTeamsPage.removeStudentFromTeamSuccess"));
    },
  });

  return {removeStudentFromTeam};
};
