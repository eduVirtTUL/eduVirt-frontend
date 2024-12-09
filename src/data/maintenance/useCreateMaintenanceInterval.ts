import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateMaintenanceIntervalDto, MaintenanceIntervalControllerApi} from "@/api";
import {keys} from "@/data/keys.ts";
import {toast} from "sonner";

export const useCreateMaintenanceInterval = (clusterId: string | undefined) => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync } = useMutation({
        mutationKey: ["createMaintenanceInterval"],
        mutationFn: async (createDto: CreateMaintenanceIntervalDto) => {
            const controller = new MaintenanceIntervalControllerApi();
            let response;
            if (clusterId != undefined)
                response = await controller.createNewClusterMaintenanceInterval(clusterId, createDto);
            else response = await controller.createNewSystemMaintenanceInterval(createDto);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS] });
            toast.success("Maintenance interval created successfully!");
        },
        onError: () => {
            toast.error("Failed to create maintenance interval");
        },
    });

    return { createMaintenanceInterval: mutate, createMaintenanceIntervalAsync: mutateAsync };
}