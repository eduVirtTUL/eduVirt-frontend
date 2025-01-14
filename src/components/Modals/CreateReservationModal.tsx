import { useDialog } from "@/stores/dialogStore";
import { useCreateReservation } from "@/data/reservation/useCreateReservation";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next, { TFunction } from "i18next";
import { CheckIcon, XCircleIcon } from "lucide-react";
import RentTimeSelector from "@/components/RentTimeSelector";
import { Input } from "@/components/ui/input";

type ResourceGroupProps = {
  courseId: string;
  podId: string;
  length: number;
  maxRentTime: number;
  start: Date;
  end: Date;
  resetSelection: () => void;
};

const createReservationSchema = (t: TFunction, start: Date, length: number, maxRentTime: number) =>
    z.object({
      reservationDuration: z.coerce.number()
        .min(2 * length, t("reservations.validation.duration.too.short"))
        .max(maxRentTime * 60, t("reservations.validation.duration.too.long")),
      automaticStartup: z.boolean(),
      notificationTime: z.coerce.number().int(t("reservations.validation.notificationTime.integer"))
        .min(0, t("reservations.validation.notificationTime.negative")),
      end: z.date().refine((value) => value > start, t("reservations.validation.endTime.beforeStart")),
    }).refine(
      (data) => data.notificationTime <= (data.end.valueOf() - start.valueOf()) / (1000 * 60 * 2),
      { message: t("reservations.validation.notificationTime.too.long"), path: ["notificationTime"] }
    );

type CreateReservationSchema = z.infer<
    ReturnType<typeof createReservationSchema>
>;

const CreateReservationModal: React.FC<ResourceGroupProps> = ({
  courseId, podId, length, maxRentTime, start, end, resetSelection,
}) => {
  const { t } = useTranslation();

  const { isOpen, close } = useDialog();
  const { createReservationAsync } = useCreateReservation({course: courseId, pod: podId});

  const form = useForm<CreateReservationSchema>({
    resolver: zodResolver(createReservationSchema(t, start, length, maxRentTime)),
    defaultValues: {
      reservationDuration: 60,
      automaticStartup: true,
      notificationTime: 10,
      end: end
    },
  });

    useEffect(() => {
        console.log("Form Values:", form.getValues());
        console.log("Is Form Valid:", form.formState.isValid);
        console.log("Errors:", form.formState.errors);
    }, [form]);

  useEffect(() => {
    if (start && end) {
      const calculatedDuration = (end.valueOf() - start.valueOf()) / (60000);
      form.reset({
        reservationDuration: calculatedDuration >= 2 * length ? calculatedDuration : 2 * length,
        automaticStartup: true,
        notificationTime: Math.floor(length / 2),
        end: end
      });
    }
  }, [start, end, form, length]);

  const handleSubmit = form.handleSubmit(
    async (values: CreateReservationSchema) => {
      const startTime = new Date(start!);
      const tempDate = new Date(startTime);
      const endTime = new Date(tempDate.setMinutes(tempDate.getMinutes() + values.reservationDuration));

      const createDto = {
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        automaticStartup: values.automaticStartup,
        notificationTime: values.notificationTime,
      };

      await createReservationAsync(createDto);
      close();
      form.reset();
    }
  );

  return (
    <Dialog
      open={isOpen("createReservation")}
      onOpenChange={() => {
        resetSelection();
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reservations.createReservation.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="reservationDuration"
              render={() => (
                <FormItem className="space-y-4">
                  <FormLabel>{t("reservations.createReservation.startTime")}</FormLabel>
                  <FormControl>
                      {start && <Input value={start.toLocaleTimeString(i18next.language)} disabled={true}/>}
                  </FormControl>
                  <FormDescription>
                      {t("reservations.createReservation.startTimeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservationDuration"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>{t("reservations.createReservation.duration")}</FormLabel>
                  <FormControl>
                    <RentTimeSelector
                      value={field.value.toString()}
                      onChange={(newValue) => {
                        const selectedDuration = parseInt(newValue, 10);
                        const newEnd = new Date(start.getTime() + selectedDuration * 60000);
                        form.setValue("reservationDuration", selectedDuration);
                        form.setValue("end", newEnd);
                        form.trigger("notificationTime");
                      }}
                      start={2 * length}
                      stop={maxRentTime * 60}
                      step={length}
                    />
                  </FormControl>
                  <FormDescription>
                      {t("reservations.createReservation.durationDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notificationTime"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>{t("reservations.createReservation.notificationTime")}</FormLabel>
                  <FormControl>
                    <Input {...field} min="0" step="1" type={"number"} />
                  </FormControl>
                  <FormDescription>
                    {t("reservations.createReservation.notificationTimeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="automaticStartup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox defaultChecked={true} onChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("reservations.createReservation.automaticStartup")}</FormLabel>
                  </div>
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

export default CreateReservationModal;
