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
  FormControl, FormDescription,
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
import { MetricDto } from "@/api";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { CheckIcon, Loader2, XCircleIcon } from "lucide-react";
import { convertValue, getBaseUnitForCategory, getUnitsCategory, UnitDefinition } from "@/utils/unitUtils.js";

type CreateClusterMetricValueProps = {
  clusterId: string;
};

const createClusterMetricValueSchema = (t: TFunction) =>
    z.object({
      metricId: z.string().nonempty(t("clusterMetricValues.validation.metricId.required")),
      value: z.coerce.number()
        .min(0, t("clusterMetricValues.validation.value.negative")),
      unit: z.string()
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

  const [ selectedCategory, setSelectedCategory ] = useState<string>();
  const [ availableUnits, setAvailableUnits ] = useState<UnitDefinition[]>([]);

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

  const handleMetricSelect = (metricId: string) => {
    const selectedMetric = allMetrics.find((metric) => metric.id === metricId);
    if (selectedMetric && selectedMetric.category) {
      setSelectedCategory(selectedMetric.category);

      const category = getUnitsCategory(selectedMetric.category);
      const baseUnit = getBaseUnitForCategory(category.key);
      form.setValue("unit", baseUnit.symbol);
      setAvailableUnits(category.units);
    } else {
      setAvailableUnits([]);
      form.setValue("unit", "");
    }
    form.setValue("metricId", metricId);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
      await createClusterMetricValueAsync({
        metricId: values.metricId!,
        value: convertValue(selectedCategory!, values.value, values.unit, getBaseUnitForCategory(selectedCategory!).symbol)
      });
      close();
      form.reset();
  });

  return (
    <Dialog
      open={isOpen("createClusterMetricValue")}
      onOpenChange={() => {
        setSelectedCategory(undefined);
        setAvailableUnits([]);
        form.reset();
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
                    onValueChange={(value) => handleMetricSelect(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("clusterMetricValues.createClusterMetricValue.select.name")} />
                    </SelectTrigger>
                      <SelectContent>
                        <div className="flex w-full flex-col items-center gap-1">
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
                  <FormDescription>
                    {t("clusterMetricValues.createClusterMetricValue.nameDescription")}
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            {availableUnits.length > 0 && (
              <FormField
                control={form.control}
                name="value"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{t("clusterMetricValues.createClusterMetricValue.value")}</FormLabel>
                    <FormControl>
                      <Input {...field} type={"number"} />
                    </FormControl>
                    <FormDescription>
                      {t("clusterMetricValues.createClusterMetricValue.valueDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {availableUnits.length > 0 && (
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => {
                  if (!field.value && availableUnits.length > 0) {
                    form.setValue("unit", availableUnits[0]?.symbol ?? "");
                  }

                  return(
                    <FormItem>
                      <FormLabel>
                        {t("clusterMetricValues.createClusterMetricValue.unit")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("clusterMetricValues.createClusterMetricValue.select.unit")} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUnits.map((unit) => (
                            <SelectItem key={unit.symbol} value={unit.symbol}>
                              {/* @ts-expect-error this doesn't impact the page */}
                              {t(unit.name)} ({t(unit.symbol)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("clusterMetricValues.createClusterMetricValue.unitDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}
            <div className="flex flex-row justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  close();
                }}
              >
                <XCircleIcon />
                {t("cancel")}
              </Button>
              <Button type="submit">
                <CheckIcon />
                {t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClusterMetricValueModal;
