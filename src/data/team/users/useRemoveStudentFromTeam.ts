import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

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
      toast.success("Student removed from team");
    },
  });

  return {removeStudentFromTeam};
};
