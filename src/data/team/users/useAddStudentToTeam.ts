import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

export const useAddStudentToTeam = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: addStudentToTeam} = useMutation({
    mutationFn: async ({teamId, email}: { teamId: string; email: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("email", email);

      const response = await privateAxios.post(
        `/teams/${teamId}/add-student`, { params: searchParams }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [keys.TEAM]});
      toast.success("Student added to team");
    },
  });

  return {addStudentToTeam};
};
