import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useTranslation } from "react-i18next";
import { PencilIcon, SaveIcon, XCircleIcon } from "lucide-react";
import { useResourceGroupPool } from "@/data/rgPool/useResourceGroupPool";
import RentTimeSelector from "../RentTimeSelector";
import { TFunction } from "i18next";
import { useUpdateResourceGroupPool } from "@/data/rgPool/useUpdateResourceGroupPool";

const editResourceGroupPoolSchema = (t: TFunction) =>
  z.object({
    description: z.string().min(1).max(1000),
    maxRentTime: z.coerce.number().min(0),
    maxRent: z.coerce
      .number()
      .min(
        0,
        t("createResourceGroupPoolModal.validation.maxRentGreaterOrEqualZero")
      ),
    gracePeriod: z.coerce
      .number()
      .min(
        0,
        t(
          "createResourceGroupPoolModal.validation.gracePeriodGreaterOrEqualZero"
        )
      ),
  });

type EditResourceGroupPoolSchema = z.infer<
  ReturnType<typeof editResourceGroupPoolSchema>
>;

type EditResourceGroupPoolModalProps = {
  poolId: string;
};

const EditResourceGroupPoolModal: React.FC<EditResourceGroupPoolModalProps> = ({
  poolId,
}) => {
  const { t } = useTranslation();
  const { resourceGroupPool } = useResourceGroupPool(poolId);
  const { updateResourceGroupPoolAsync } = useUpdateResourceGroupPool();
  const form = useForm<EditResourceGroupPoolSchema>({
    resolver: zodResolver(editResourceGroupPoolSchema(t)),
    values: {
      description: resourceGroupPool?.description ?? "",
      maxRentTime: resourceGroupPool?.maxRentTime ?? 0,
      maxRent: resourceGroupPool?.maxRent ?? 0,
      gracePeriod: resourceGroupPool?.gracePeriod ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await updateResourceGroupPoolAsync({
      id: poolId,
      ...data,
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PencilIcon />
          Edytuj
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj pulę grup zasobów</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxRentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.maxRentTime")}
                  </FormLabel>
                  <FormControl>
                    <RentTimeSelector
                      value={field.value.toString()}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("createResourceGroupPoolModal.maxRentTimeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.maxRent")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    {t("createResourceGroupPoolModal.maxRentDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gracePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.gracePeriod")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    {t("createResourceGroupPoolModal.gracePeriodDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <DialogClose
                asChild
                onClick={() => {
                  form.reset();
                }}
              >
                <Button variant="secondary">
                  <XCircleIcon />
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button type="submit">
                <SaveIcon />
                {t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResourceGroupPoolModal;
