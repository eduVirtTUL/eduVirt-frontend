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
  const { metrics, isLoading } = useMetrics();

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
          <DialogTitle>Create a metric value</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="metricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
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
