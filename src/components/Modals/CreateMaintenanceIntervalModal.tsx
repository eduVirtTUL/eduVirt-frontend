import { useDialog } from "@/stores/dialogStore";
import { useCreateMaintenanceInterval } from "@/data/maintenance/useCreateMaintenanceInterval";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

type CreateMaintenanceIntervalModalProps = {
  clusterId: string | undefined;
  start: Date;
  end: Date;
  resetSelection: () => void;
};

const createMaintenanceIntervalSchema = (t: TFunction) =>
  z.object({
    cause: z.string()
      .min(4, t("maintenanceIntervals.validation.cause.too.short"))
      .max(128, t("maintenanceIntervals.validation.cause.too.long")),
    description: z.string()
      .max(256, "maintenanceIntervals.validation.description.too.long")
      .optional(),
    duration: z.coerce.number()
      .min(1, "maintenanceIntervals.validation.duration.too.short")
      .max(48, "maintenanceIntervals.validation.duration.too.long"),
  });

type CreateMaintenanceIntervalSchema = z.infer<
  ReturnType<typeof createMaintenanceIntervalSchema>
>;

const CreateMaintenanceIntervalModal: React.FC<CreateMaintenanceIntervalModalProps> = ({ clusterId, start, end, resetSelection }) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createMaintenanceIntervalAsync } = useCreateMaintenanceInterval(clusterId);

  const form = useForm<CreateMaintenanceIntervalSchema>({
    resolver: zodResolver(createMaintenanceIntervalSchema(t)),
    defaultValues: {
      cause: "",
      description: "",
      duration: 1,
    },
  });

  useEffect(() => {
    if (start && end) {
      const calculatedDuration = (end.valueOf() - start.valueOf()) / (1000 * 60 * 60);
      form.reset({
        cause: "",
        description: "",
        duration: calculatedDuration >= 1 ? calculatedDuration : 1,
      });
    }
  }, [start, end, form]);

  const handleSubmit = form.handleSubmit(
    async (values: CreateMaintenanceIntervalSchema) => {
      const startTime = new Date(start!);
      const tempDate = new Date(startTime);
      const endTime = new Date(
        tempDate.setHours(tempDate.getHours() + values.duration)
      );

      console.log(start);
      console.log(end);

      const createDto = {
        cause: values.cause,
        description: values.description,
        beginAt: startTime.toISOString(),
        endAt: endTime.toISOString(),
      };

      await createMaintenanceIntervalAsync(createDto);
      close();
      form.reset();
    }
  );

  return (
    <>
      <Dialog
        open={isOpen("createInterval")}
        onOpenChange={() => {
          resetSelection();
          close();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("maintenanceIntervals.createMaintenanceInterval.title")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="cause"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>{t("maintenanceIntervals.createMaintenanceInterval.cause")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>{t("maintenanceIntervals.createMaintenanceInterval.description")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>{t("maintenanceIntervals.createMaintenanceInterval.duration")}</FormLabel>
                    <FormControl>
                      <Input {...field} type={"number"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {t("maintenanceIntervals.createMaintenanceInterval.submit")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateMaintenanceIntervalModal;
