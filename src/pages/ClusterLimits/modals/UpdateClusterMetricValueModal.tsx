import {useTranslation} from "react-i18next";
import {useDialog} from "@/stores/dialogStore";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateMetricValueDto} from "@/api";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {useUpdateClusterMetricValue} from "@/data/cluster-metrics/useUpdateClusterMetricValue";
import {TFunction} from "i18next";

type UpdateClusterMetricValueProps = {
    clusterId: string;
    metricId: string;
};

const updateClusterMetricValueSchema = (t: TFunction) =>
    z.object({
      value: z.coerce.number()
        .min(0, t("clusterMetricValues.validation.value.negative")),
    });

type UpdateClusterMetricValueSchema = z.infer<
    ReturnType<typeof updateClusterMetricValueSchema>
>;

const UpdateClusterMetricValueModal: React.FC<UpdateClusterMetricValueProps> = ({
  clusterId, metricId
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { updateClusterMetricValueAsync } = useUpdateClusterMetricValue(clusterId!, metricId!);

  const form = useForm<UpdateClusterMetricValueSchema>({
    resolver: zodResolver(updateClusterMetricValueSchema(t)),
    defaultValues: {
      value: 0,
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values: CreateMetricValueDto) => {
      await updateClusterMetricValueAsync(values);
      close();
      form.reset();
    }
  );

  return (
    <Dialog
      open={isOpen("updateClusterMetricValue")}
      onOpenChange={() => {
        close();
      }}
    >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("clusterMetricValues.updateClusterMetricValue.title")}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className={"space-y-4"}>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("clusterMetricValues.updateClusterMetricValue.value")}</FormLabel>
                <FormControl>
                  <Input {...field} type={"number"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("clusterMetricValues.updateClusterMetricValue.submit")}</Button>
        </form>
      </Form>
    </DialogContent>
    </Dialog>
  );
};

export default UpdateClusterMetricValueModal;