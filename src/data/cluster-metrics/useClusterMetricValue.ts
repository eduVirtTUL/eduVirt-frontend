import { useQuery } from "@tanstack/react-query";
import { keys } from "@/data/keys";
import { privateAxios } from "@/data/privateAxios";
import { GeneralMetricValueDto } from "@/api";
import { stripEtag } from "@/utils/requestUtils";

type UseClusterMetricValueParams = {
  clusterId: string;
  metricId: string;
}

export const useClusterMetricValue = ({
  clusterId, metricId
}: UseClusterMetricValueParams) => {
  const { data, isLoading } = useQuery({
    queryKey: [ keys.CLUSTER_METRIC_VALUES, clusterId, metricId ],
    queryFn: async() => {
      const response = await privateAxios.get<GeneralMetricValueDto>(
        `/clusters/${clusterId}/metrics/${metricId}`
      );
      const etag = response.headers["etag"] as string;
      return { data: response.data, etag: stripEtag(etag) };
    },
  });

  return { metricValue: data?.data, etag: data?.etag, isLoading };
};