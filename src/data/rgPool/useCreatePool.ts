import { CreateRGPoolDto, ResourceGroupPoolControllerApi } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";

type CreateRgPool = Required<CreateRGPoolDto>;

export const useCreatePool = () => {
  const client = useQueryClient();
  const token = localStorage.getItem("token") ?? "";
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createPool"],
    mutationFn: async (pool: CreateRgPool) => {
      const controller = new ResourceGroupPoolControllerApi();
      const response = await controller.createResourceGroupPool(pool, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create resource group pool");
    },
    onSuccess: () => {
      toast.success("Resource group pool created");
      client.invalidateQueries({ queryKey: [keys.RESOURCE_GROUP] });
    },
  });

  return { createPool: mutate, createPoolAsync: mutateAsync };
};
