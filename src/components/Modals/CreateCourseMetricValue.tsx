import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "@/stores/dialogStore";
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
import { CircleXIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useCreateCourseMetric } from "@/data/course/metrics/useCreateCourseMetric";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

type CreateCourseMetricValueProps = {
  courseId: string;
};

const createCourseMetricValueSchema = (t: TFunction) =>
  z.object({
    metricId: z.string().min(1, t("courseLimits.validation.metricRequired")),
    value: z.coerce
      .number()
      .min(0, t("courseLimits.validation.valueMustBeGraterOrEqualZero")),
  });

type CreateCourseMetricValueSchema = z.infer<
  ReturnType<typeof createCourseMetricValueSchema>
>;

const CreateCourseMetricValueModal: React.FC<CreateCourseMetricValueProps> = ({
  courseId,
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createCourseMetricAsync } = useCreateCourseMetric();
  const { metrics, isLoading } = useMetrics({ page: 0, size: 10 });

  const form = useForm<CreateCourseMetricValueSchema>({
    resolver: zodResolver(createCourseMetricValueSchema(t)),
    defaultValues: {
      metricId: "",
      value: 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createCourseMetricAsync({ courseId, ...values });
    close();
    form.reset();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col my-auto items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen("createCourseMetricValue")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("courseLimits.createCourseMetricValue.title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="metricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("courseLimits.createCourseMetricValue.metric")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "courseLimits.createCourseMetricValue.select"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {metrics &&
                        metrics.map((metric) => (
                          <SelectItem value={metric.id!} key={metric.id}>
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
                  <FormLabel>
                    {t("courseLimits.createCourseMetricValue.value")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type={"number"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <Button
                type="button"
                onClick={() => {
                  close();
                  form.reset();
                }}
                variant="secondary"
              >
                <CircleXIcon />
                {t("cancel")}
              </Button>
              <Button type="submit">
                <PlusIcon />
                {t("courseLimits.createCourseMetricValue.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseMetricValueModal;
