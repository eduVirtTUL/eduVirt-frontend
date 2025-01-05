import { PodControllerApi } from "@/api";
import { toast } from "sonner";
import { keys } from "../keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteStatelessPod = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: async ({ teamId, resourceGroupPoolId }: { teamId: string, resourceGroupPoolId: string }) => {
            const controller = new PodControllerApi();
            const response = await controller.deleteStatelessPod(teamId, resourceGroupPoolId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.STATELESS_POD] });
            queryClient.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP, 'withPods'] });
            toast.success("Stateless pod deleted successfully!");
        },
        onError: () => [toast.error("Failed to delete stateless pod")],
    });
    
    return { deleteStatelessPod: mutate, deleteStatelessPodAsync: mutateAsync, isPending };
};