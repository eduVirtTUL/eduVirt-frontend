import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";

export const useJoinTeamOrCourse = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  const { mutate: joinTeam } = useMutation({
    mutationFn: async (key: string) => {
      const response = await privateAxios.post(
        '/teams/join',
        { keyValue: key }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.TEAM] });
      toast.success(t("joinTeam.success"));
    },
  });

  return { joinTeam };
};