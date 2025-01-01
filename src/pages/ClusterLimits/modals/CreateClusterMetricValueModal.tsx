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
import React from "react";
import { useMetrics } from "@/data/metrics/useMetrics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateMetricValueDto } from "@/api";
import { LoaderIcon } from "lucide-react";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

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
  const { isOpen, close } = useDialog();
  const { createClusterMetricValueAsync } = useCreateClusterMetricValue(clusterId!);
  const { metrics, isLoading } = useMetrics();

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

  if (isLoading) {
    return (
      <div className="flex flex-col my-auto items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

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
                      {metrics?.items?.map((metric) => (
                        <SelectItem value={metric.id!}>
                          {metric.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
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
