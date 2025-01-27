import { useTranslation } from "react-i18next";
import { useDialog } from "@/stores/dialogStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, {useEffect} from "react";
import { useUpdateClusterMetricValue } from "@/data/cluster-metrics/useUpdateClusterMetricValue";
import { TFunction } from "i18next";
import {
    convertValue, getBaseUnit,
    getBaseUnitValue,
    getUnitsCategory,
    UnitDefinition
} from "@/utils/unitUtils.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SaveIcon, XCircleIcon } from "lucide-react";
import { useClusterMetricValue } from "@/data/cluster-metrics/useClusterMetricValue";
import {Skeleton} from "@/components/ui/skeleton";

type UpdateClusterMetricValueProps = {
  clusterId: string;
  metricId: string;
};

const updateClusterMetricValueSchema = (t: TFunction) =>
  z.object({
    value: z.coerce.number()
      .min(0, t("clusterMetricValues.validation.value.negative")),
    unit: z.string()
      .nonempty(t("clusterMetricValues.validation.unit.required"))
  });

type UpdateClusterMetricValueSchema = z.infer<
    ReturnType<typeof updateClusterMetricValueSchema>
>;

const UpdateClusterMetricValueModal: React.FC<UpdateClusterMetricValueProps> = ({
  clusterId, metricId
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { metricValue, etag, isLoading } = useClusterMetricValue({clusterId, metricId});
  console.log(metricValue);

  const { updateClusterMetricValueAsync } = useUpdateClusterMetricValue();
  const availableUnits: UnitDefinition[] =  metricValue?.metric?.category ? getUnitsCategory(metricValue.metric.category).units : [];

  const form = useForm<UpdateClusterMetricValueSchema>({
    resolver: zodResolver(updateClusterMetricValueSchema(t)),
    defaultValues: {
        value: metricValue?.metric?.category ? getBaseUnitValue(metricValue.metric.category, metricValue.value ?? 0) : 0,
        unit: metricValue?.metric?.category ? getBaseUnit(metricValue.metric.category).symbol : "",
    },
  });

  useEffect(() => {
    console.log("executes");
    console.log(metricValue);
    if (metricValue && metricValue.metric?.category) {
      console.log("loaded");
      form.reset({
        value: getBaseUnitValue(metricValue.metric.category, metricValue.value!),
        unit: getBaseUnit(metricValue.metric.category).symbol
      });
    }
  }, [metricValue, isLoading, form]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      if (!metricValue || !metricValue.metric?.category) return;

      close();
      form.reset();
      await updateClusterMetricValueAsync({
        clusterId: clusterId,
        metricId: metricId,
        etag: etag ?? "",
        metricValueId: metricValue.id!,
        version: metricValue.version,
        value: convertValue(metricValue.metric.category!, values.value, values.unit)
      });
    }
  );

  return (
    <Dialog
      open={isOpen("updateClusterMetricValue")}
      onOpenChange={() => {
        form.reset();
        close();
      }}
    >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("clusterMetricValues.updateClusterMetricValue.title")}</DialogTitle>
      </DialogHeader>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="flex flex-row justify-between pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* {t("clusterMetricValues.updateClusterMetricValue.value")}</FormLabel>
                  <FormControl>
                    <Input {...field} type={"number"} />
                  </FormControl>
                  <FormDescription>
                    {t("clusterMetricValues.updateClusterMetricValue.valueDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <FormLabel>* {t("clusterMetricValues.updateClusterMetricValue.unit")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("clusterMetricValues.updateClusterMetricValue.select.unit")} />
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
                        {t("clusterMetricValues.updateClusterMetricValue.unitDescription")}
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
            <Button
              type="submit"
              disabled={!form.formState.isValid}
            >
                <SaveIcon />
              {t("clusterMetricValues.updateClusterMetricValue.save")}
            </Button>
          </div>
        </form>
      </Form>}
    </DialogContent>
    </Dialog>
  );
};

export default UpdateClusterMetricValueModal;