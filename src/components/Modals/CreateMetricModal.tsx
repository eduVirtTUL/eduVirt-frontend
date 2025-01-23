import { TFunction } from "i18next";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/stores/dialogStore";
import { useCreateMetric } from "@/data/metrics/useCreateMetric";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import React from "react";
import { CategoryDefinition, getCategories } from "@/utils/unitUtils.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CreateMetricDto } from "@/api";
import { CheckIcon, XCircleIcon } from "lucide-react";

const createMetricSchema = (t: TFunction) =>
  z.object({
    name: z.string()
      .nonempty(t("metrics.validation.name.required"))
      .min(8, t("metrics.validation.name.too.short"))
      .max(64, t("metrics.validation.name.too.long"))
      .regex(new RegExp(/^[A-Za-z0-9_]{8,64}$/), t("metrics.validation.name.invalid.format")),
    category: z.string()
      .nonempty(t("metrics.validation.category.empty"))
  });

type CreateMetricSchema = z.infer<
  ReturnType<typeof createMetricSchema>
>;

const CreateMetricModal: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createMetricAsync } = useCreateMetric();
  const categories = getCategories();

  const form = useForm<CreateMetricSchema>({
    resolver: zodResolver(createMetricSchema(t)),
    defaultValues: {
      name: "",
      category: ""
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createMetricAsync({name: values.name, category: values.category} as CreateMetricDto);
      console.log(values.category);
      form.reset();
      close();
    }
  );

  return (
    <Dialog
      open={isOpen("createMetric")}
      onOpenChange={() => {
        form.reset();
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("metrics.createMetric.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* {t("metrics.createMetric.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("metrics.createMetric.nameDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({field}) => (
                <FormItem>
                  <FormLabel>* {t("metrics.createMetric.category")}</FormLabel>
                  <Select
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("metrics.createMetric.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="flex w-full flex-col items-center gap-1">
                        {categories.map((category: CategoryDefinition) => (
                          <SelectItem key={category.key} value={category.key}>
                            {/* @ts-expect-error this doesn't impact the page */}
                            {t(category.label as string)}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("metrics.createMetric.categoryDescription")}
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
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

export default CreateMetricModal;