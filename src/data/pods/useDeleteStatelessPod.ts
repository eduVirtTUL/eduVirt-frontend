import { toast } from "sonner";
import { keys } from "../keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateAxios } from "@/data/privateAxios";

export const useDeleteStatelessPod = () => {
  const queryClient = useQueryClient();
  
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await privateAxios.delete<void>(
        `/pods/stateless/${id}`
      );
      return response.data;
    },
    onSuccess: (_, podId) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pod = queryClient.getQueryData<any>([keys.STATELESS_POD, podId]);
      const teamId = pod?.team?.id;
      const courseId = pod?.courseId;
      
      if (teamId) {
        queryClient.invalidateQueries({ 
          queryKey: [keys.STATELESS_POD, 'team', teamId] 
        });
      }

      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: [keys.STATELESS_POD, 'course', courseId] 
        });
      }

      queryClient.invalidateQueries({ 
        queryKey: [keys.STATELESS_POD] 
      });
      
      toast.success("Stateless pod deleted successfully!");
    },
  });
    
  return { deleteStatelessPod: mutate, deleteStatelessPodAsync: mutateAsync, isPending };
};