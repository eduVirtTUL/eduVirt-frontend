import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

export const useRemoveMaintenanceInterval = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "removeMaintenanceInterval" ],
    mutationFn: async (id: string) => {
      const response = await privateAxios.post<void>(
        `/maintenance-intervals/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS] });
      toast.success(t("maintenanceIntervals.removeMaintenanceInterval.success"));
    }
  });

  return {
    removeMaintenanceInterval: mutate,
    removeMaintenanceIntervalAsync: mutateAsync,
  };
};
