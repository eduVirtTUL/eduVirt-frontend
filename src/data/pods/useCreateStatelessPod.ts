import {CreatePodStatelessDto, PodStatelessDto} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { keys } from "../keys";
import {privateAxios} from "@/data/privateAxios";

export const useCreateStatelessPod = () => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createStatelessPod"],
    mutationFn: async (pod: CreatePodStatelessDto) => {
      const response = await privateAxios.post<PodStatelessDto>(
        `/pods/stateless`, pod
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.STATELESS_POD] });
      toast.success("Stateless pod created successfully!");
    },
  });

  return { createStatelessPod: mutate, createStatelessPodAsync: mutateAsync };
}