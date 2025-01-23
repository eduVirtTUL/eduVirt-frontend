import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../keys";
import { toast } from "sonner";
import { privateAxios } from "@/data/privateAxios";
import { t } from "i18next";

export const useDeleteStatefulPod = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await privateAxios.delete<void>(
        `/pods/stateful/${id}`
      );
      return response.data;
    },
    onSuccess: (_, podId) => {
      queryClient.invalidateQueries({ queryKey: [keys.POD] });
      queryClient.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP, 'withPods'] });
      queryClient.invalidateQueries({ queryKey: keys.POD, id: podId });
      toast.success(t("statefulPodManagement.delete.success"));
    }
  });

  return { deleteStatefulPod: mutate, deleteStatefulPodAsync: mutateAsync, isPending };
}