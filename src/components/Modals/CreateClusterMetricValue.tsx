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
import Select from "@/components/ui/select";
import { CreateMetricValueDto } from "@/api";

type CreateClusterMetricValueProps = {
  clusterId: string;
};

const createClusterMetricValueSchema = z.object({
  metricId: z.string(),
  value: z.coerce.number().min(0),
});

type CreateClusterMetricValueSchema = z.infer<
  typeof createClusterMetricValueSchema
>;

const CreateClusterMetricValueModal: React.FC<
  CreateClusterMetricValueProps
> = ({ clusterId }) => {
  const { isOpen, close } = useDialog();
  const { createClusterMetricValueAsync } = useCreateClusterMetricValue(
    clusterId!
  );
  const { metrics } = useMetrics();

  const form = useForm<CreateClusterMetricValueSchema>({
    resolver: zodResolver(createClusterMetricValueSchema),
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
          <DialogTitle>Create a metric value</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="metricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select {...field}>
                    {metrics?.items?.map((metric, index) => (
                      <option
                        key={metric.id}
                        value={metric.id}
                        selected={index === 0}
                      >
                        {metric.name}
                      </option>
                    ))}
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} type={"number"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create metric value</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClusterMetricValueModal;
