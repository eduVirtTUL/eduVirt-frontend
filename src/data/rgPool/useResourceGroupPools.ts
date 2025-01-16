import { PageDtoDetailedResourceGroupPoolDto } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { keys } from "../keys";
import { privateAxios } from "../privateAxios";
import { create } from "zustand";
import { useUser } from "@/stores/userStore";
type ResourceGroupPoolFilters = {
  name: string;
  courseId: string;
  setFilters: (filters: { name: string; courseId: string }) => void;
};

export const useResourceGroupPoolsFilters = create<ResourceGroupPoolFilters>(
  (set) => ({
    name: "",
    courseId: "",
    setFilters: (filters) => set(filters),
  })
);

export const useResourceGroupPools = (page: number, size: number) => {
  const { name, courseId } = useResourceGroupPoolsFilters();
  const { activeRole } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: [keys.RESOURCE_GROUP, page, size, name, courseId],
    queryFn: async () => {
      if (activeRole === "teacher") {
        const response =
          await privateAxios.get<PageDtoDetailedResourceGroupPoolDto>(
            `/resource-group-pool/teacher`,
            {
              params: {
                page,
                size,
                name,
                courseId,
              },
            }
          );
        return response.data;
      }

      const response =
        await privateAxios.get<PageDtoDetailedResourceGroupPoolDto>(
          `/resource-group-pool`,
          {
            params: {
              page,
              size,
              name,
              courseId,
            },
          }
        );
      return response.data;
    },
  });

  return { resourceGroupPools: data, isLoading };
};
