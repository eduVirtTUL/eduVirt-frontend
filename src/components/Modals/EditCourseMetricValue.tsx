import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDialog } from "@/stores/dialogStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useCourseMetric } from "@/data/course/metrics/useCourseMetric";
import { useUpdateCourseMetric } from "@/data/course/metrics/useUpdateCourseMetric";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { CircleXIcon, SaveIcon } from "lucide-react";

type EditCourseMetricValueProps = {
  courseId: string;
  metricId: string;
};

const editCourseMetricValueSchema = z.object({
  value: z.coerce.number().min(0),
});

type EditCourseMetricValueSchema = z.infer<typeof editCourseMetricValueSchema>;

const EditCourseMetricValue: React.FC<EditCourseMetricValueProps> = ({
  courseId,
  metricId,
}) => {
  const { t } = useTranslation();
  const { courseMetric } = useCourseMetric(courseId, metricId);
  const { updateCourseMetricAsync } = useUpdateCourseMetric();
  const form = useForm<EditCourseMetricValueSchema>({
    resolver: zodResolver(editCourseMetricValueSchema),
    values: {
      value: courseMetric?.value ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await updateCourseMetricAsync({
      courseId,
      metricId,
      ...values,
    });
    close();
  });

  const { isOpen, close } = useDialog();
  return (
    <Dialog open={isOpen("editCourseMetric")} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("courseLimits.editCourseMetricValue.title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("courseLimits.editCourseMetricValue.value")}
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
                <SaveIcon />
                {t("courseLimits.editCourseMetricValue.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseMetricValue;
