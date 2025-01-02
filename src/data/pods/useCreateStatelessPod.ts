import { CreateStatelessPodDto, PodControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";

export const useCreateStatelessPod = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync } = useMutation({
        mutationKey: ["createStatelessPod"],
        mutationFn: async (pod: CreateStatelessPodDto) => {
            const controller = new PodControllerApi();
            const response = await controller.createStatelessPod(pod);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.POD] });
            toast.success("Stateless pod created successfully!");
        },
        onError: () => {
            toast.error("Failed to create stateless pod");
        },
    });

    return { createStatelessPod: mutate, createStatelessPodAsync: mutateAsync };  
}