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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

type ResourceGroupProps = {
  resourceGroupId: string;
  start: Date;
  end: Date;
  resetSelection: () => void;
};

const createReservationSchema = (t: TFunction) =>
    z.object({
      reservationDuration: z.coerce.number()
        .min(1, t("reservations.validation.duration.too.short"))
        .max(24, t("reservations.validation.duration.too.long")),
      automaticStartup: z.boolean(),
    });

type CreateReservationSchema = z.infer<
    ReturnType<typeof createReservationSchema>
>;

const CreateReservationModal: React.FC<ResourceGroupProps> = ({
  resourceGroupId,
  start,
  end,
  resetSelection,
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createReservationAsync } = useCreateReservation();

  const form = useForm<CreateReservationSchema>({
    resolver: zodResolver(createReservationSchema(t)),
    defaultValues: {
      reservationDuration: 1,
      automaticStartup: true,
    },
  });

  useEffect(() => {
    if (start && end) {
      const calculatedDuration =
        (end.valueOf() - start.valueOf()) / (1000 * 60 * 60);
      form.reset({
        reservationDuration: calculatedDuration >= 1 ? calculatedDuration : 1,
        automaticStartup: true,
      });
    }
  }, [start, end, form]);

  const handleSubmit = form.handleSubmit(
    async (values: CreateReservationSchema) => {
      const startTime = new Date(start!);
      const tempDate = new Date(startTime);
      const endTime = new Date(
        tempDate.setHours(tempDate.getHours() + values.reservationDuration)
      );

      const createDto = {
        resourceGroupId: resourceGroupId,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        automaticStartup: values.automaticStartup,
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
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>{t("reservations.createReservation.duration")}</FormLabel>
                  <FormControl>
                    <Input {...field} type={"number"} />
                  </FormControl>
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
            <Button type="submit">{t("reservations.createReservation.submit")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservationModal;
