import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

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
      toast.success("Team successfully deleted");
    },
  });

  return {deleteTeam};
};
