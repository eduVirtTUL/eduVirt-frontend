import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "@/stores/dialogStore";
import { useCreateClusterMetricValue } from "@/data/cluster-metrics/useCreateClusterMetricValue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useMetrics } from "@/data/metrics/useMetrics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateMetricValueDto, MetricDto } from "@/api";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {Loader2} from "lucide-react";

type CreateClusterMetricValueProps = {
  clusterId: string;
};

const createClusterMetricValueSchema = (t: TFunction) =>
    z.object({
      metricId: z.string().min(1, t("clusterMetricValues.validation.metricId.required")),
      value: z.coerce.number()
        .min(0, t("clusterMetricValues.validation.value.negative"))
    });

type CreateClusterMetricValueSchema = z.infer<
  ReturnType<typeof createClusterMetricValueSchema>
>;

const CreateClusterMetricValueModal: React.FC<
  CreateClusterMetricValueProps
> = ({ clusterId }) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(8);
  const [ hasMore, setHasMore ] = useState<boolean>(true);
  const [ loading, setLoading ] = useState<boolean>(false);

  const { isOpen, close } = useDialog();
  const { createClusterMetricValueAsync } = useCreateClusterMetricValue(clusterId!);

  const { metrics } = useMetrics({ page: pageNumber, size: pageSize});
  const { metrics: nextMetrics } = useMetrics({ page: pageNumber + 1, size: pageSize});

  const [ allMetrics, setAllMetrics ] = useState<MetricDto[]>([]);

  const fetchNextMetrics = async () => {
    setLoading(true);
    setAllMetrics((prev) => [...prev, ...metrics ?? []]);

    if (nextMetrics && nextMetrics.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setPageNumber((prev) => prev + 1);
    setLoading(false);
  };

  const form = useForm<CreateClusterMetricValueSchema>({
    resolver: zodResolver(createClusterMetricValueSchema(t)),
    defaultValues: {
      metricId: "",
      value: 0,
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values: CreateMetricValueDto) => {
      await createClusterMetricValueAsync(values);
      close();
      form.reset();
    }
  );

  return (
    <Dialog
      open={isOpen("createClusterMetricValue")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("clusterMetricValues.createClusterMetricValue.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="metricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("clusterMetricValues.createClusterMetricValue.name")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("clusterMetricValues.createClusterMetricValue.select")} />
                    </SelectTrigger>
                      <SelectContent>
                        <div className="flex w-full flex-col items-center  gap-3">
                          {allMetrics.map((metric) => (
                            <SelectItem key={metric.id!} value={metric.id!}>
                              {metric.name}
                            </SelectItem>
                          ))}
                          <InfiniteScroll hasMore={hasMore} isLoading={loading} next={fetchNextMetrics} threshold={1}>
                            {hasMore && <Loader2 className="my-2 h-6 w-6 animate-spin"/>}
                          </InfiniteScroll>
                          </div>
                      </SelectContent>
                  </Select>
                    <FormMessage/>
                </FormItem>
              )}
            />
              <FormField
                  control={form.control}
                  name="value"
                  render={({field}) => (
                      <FormItem>
                          <FormLabel>{t("clusterMetricValues.createClusterMetricValue.value")}</FormLabel>
                  <FormControl>
                    <Input {...field} type={"number"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("clusterMetricValues.createClusterMetricValue.submit")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClusterMetricValueModal;
