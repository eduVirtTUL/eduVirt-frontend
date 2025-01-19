import { UpdateTeamDto, TeamWithCourseDto } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";

type UpdateTeam = {
  id: string;
  etag: string;
} & UpdateTeamDto;

export const useUpdateTeam = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
    
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, etag, ...data }: UpdateTeam) => {
      const response = await privateAxios.put<TeamWithCourseDto>(
        `/teams/${id}`, 
        data,
        {
          headers: {
            "If-Match": etag,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      queryClient.invalidateQueries({ queryKey: [keys.TEAM, variables.id] });
      toast.success(t("editTeam.success"));
    },
  });

  return { updateTeam: mutate, updateTeamAsync: mutateAsync, isPending };
};