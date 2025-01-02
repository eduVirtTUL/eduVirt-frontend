import { CreatePodStatefulDto, PodControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";

export const useCreateStatefulPod = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync } = useMutation({
        mutationKey: ["createStatefulPod"],
        mutationFn: async (pod: CreatePodStatefulDto) => {
            const controller = new PodControllerApi();
            const response = await controller.createStatefulPod(pod);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.POD] });
            toast.success("Stateful pod created successfully!");
        },
        onError: () => {
            toast.error("Failed to create stateful pod");
        },
    });

    return { createStatefulPod: mutate, createStatefulPodAsync: mutateAsync };  
}