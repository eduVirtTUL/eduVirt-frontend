import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useDeleteStatelessPodsBatch = () => {
  const queryClient = useQueryClient();
  
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["deleteStatelessPodsBatch"],
    mutationFn: async (podIds: string[]) => {
      const response = await privateAxios.delete<void>(
        `/pods/stateless/batch`, 
        { data: podIds }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.STATELESS_POD] });
      toast.success(t("podManagement.deleteSuccess"));
    },
  });

  return { deleteStatelessPodsBatch: mutate, deleteStatelessPodsBatchAsync: mutateAsync };
};