import {TFunction} from "i18next";
import {z} from "zod";
import {useTranslation} from "react-i18next";
import {useDialog} from "@/stores/dialogStore";
import {useCreateMetric} from "@/data/metrics/useCreateMetric";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateMetricDto} from "@/api";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";

const createMetricSchema = (t: TFunction) =>
    z.object({
        name: z.string()
          .min(8, t("metrics.validation.name.too.short"))
          .max(64, t("metrics.validation.name.too.long"))
    });

type CreateMetricSchema = z.infer<
    ReturnType<typeof createMetricSchema>
>;

const CreateMetricModal: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createMetricAsync } = useCreateMetric();

  const form = useForm<CreateMetricSchema>({
    resolver: zodResolver(createMetricSchema(t)),
    defaultValues: {
      name: ""
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values: CreateMetricDto) => {
      await createMetricAsync(values);
            close();
            form.reset();
    }
  );

  return (
    <Dialog
      open={isOpen("createMetric")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("metrics.createMetric.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("metrics.createMetric.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("metrics.createMetric.submit")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMetricModal;