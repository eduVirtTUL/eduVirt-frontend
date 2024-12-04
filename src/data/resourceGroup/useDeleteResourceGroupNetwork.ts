import { PrivateNetworkControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceGroupKeys } from "../keys";
import { useParams } from "react-router";

export const useDeleteResourceGroupNetwork = () => {
  const { id: rgId } = useParams();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const controller = new PrivateNetworkControllerApi();
      await controller.deleteNetwork(id);
    },
    onSuccess: () => {
      console.log(rgId);

      toast.success("Network deleted");
      return queryClient.invalidateQueries({
        queryKey: resourceGroupKeys.networks(rgId!),
      });
    },
    onError: () => {
      toast.error("Failed to delete network");
    },
  });

  return { deleteNetwork: mutate, deleteNetworkAsync: mutateAsync };
};
