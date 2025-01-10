import { PodStatelessControllerApi } from "@/api";
import { toast } from "sonner";
import { keys } from "../keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteStatelessPod = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: async ({ podId }: { podId: string }) => {
            const controller = new PodStatelessControllerApi();
            const response = await controller.deleteStatelessPod(podId);
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