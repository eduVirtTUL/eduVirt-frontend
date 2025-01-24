import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: deleteTeam} = useMutation({
    mutationFn: async (teamId: string) => {
      const response = await privateAxios.delete<void>(
        `/teams/${teamId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.TEAM]});
      toast.success(t("createTeam.deleteSuccess"));
    },
  });

  return {deleteTeam};
};
