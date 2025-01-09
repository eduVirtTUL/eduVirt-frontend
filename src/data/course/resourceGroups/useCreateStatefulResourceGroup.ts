import { CourseControllerApi, CreateResourceGroupDto } from "@/api";
import { courseKeys } from "@/data/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateResourceGroup = {
  id: string;
} & CreateResourceGroupDto;

export const useCreateStatefulResourceGroup = () => {
  const token = localStorage.getItem("token") ?? "";
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, ...org }: CreateResourceGroup) => {
      const controller = new CourseControllerApi();
      const response = await controller.createResourceGroup(id, org, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.resourceGroups(id),
      });
      toast.success("Resource group created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return {
    createResourceGroup: mutate,
    createResourceGroupAsync: mutateAsync,
    isPending,
  };
};
