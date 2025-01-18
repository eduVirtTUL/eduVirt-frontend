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
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import i18next, { TFunction } from "i18next";
import { CheckIcon, XCircleIcon } from "lucide-react";

type CreateMaintenanceIntervalModalProps = {
  clusterId: string | undefined;
  start: Date;
  end: Date;
  resetSelection: () => void;
};

const createMaintenanceIntervalSchema = (t: TFunction) =>
  z.object({
    cause: z.string()
      .nonempty(t("maintenanceIntervals.validation.cause.required"))
      .min(4, t("maintenanceIntervals.validation.cause.too.short"))
      .max(128, t("maintenanceIntervals.validation.cause.too.long")),
    description: z.string()
      .max(256, t("maintenanceIntervals.validation.description.too.long"))
      .optional(),
    duration: z.coerce.number()
      .min(1, t("maintenanceIntervals.validation.duration.too.short"))
      .max(24, t("maintenanceIntervals.validation.duration.too.long")),
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
                    <FormLabel>* {t("maintenanceIntervals.createMaintenanceInterval.cause")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("maintenanceIntervals.createMaintenanceInterval.causeDescription")}
                    </FormDescription>
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
                    <FormDescription>
                      {t("maintenanceIntervals.createMaintenanceInterval.descriptionDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <>
                    <FormItem className="space-y-4">
                      <FormLabel>{t("maintenanceIntervals.createMaintenanceInterval.startTime")}</FormLabel>
                      <FormControl>
                        {start && <Input value={start.toLocaleTimeString(i18next.language)} disabled={true}/>}
                      </FormControl>
                      <FormDescription>
                        {t("maintenanceIntervals.createMaintenanceInterval.startTimeDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    <FormItem className="space-y-4">
                      <FormLabel>* {t("maintenanceIntervals.createMaintenanceInterval.duration")}</FormLabel>
                      <FormControl>
                        <Input {...field} type={"number"} />
                      </FormControl>
                      <FormDescription>
                        {t("maintenanceIntervals.createMaintenanceInterval.durationDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
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
    </>
  );
};

export default CreateMaintenanceIntervalModal;
