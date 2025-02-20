import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDialog } from "@/stores/dialogStore";
import { useTranslation } from "react-i18next";
import { CheckIcon, XCircleIcon } from "lucide-react";
import RentTimeSelector from "../RentTimeSelector";
import { TFunction } from "i18next";

const createResourceGroupSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("createResourceGroupModal.validation.nameRequired"))
      .max(50, t("createResourceGroupModal.validation.nameMaxLength")),
    description: z
      .string()
      .max(1000, t("createResourceGroupModal.validation.descriptionMaxLength"))
      .optional(),
    maxRentTime: z.coerce
      .number()
      .min(
        0,
        t("createResourceGroupModal.validation.maxRentTimeGreaterOrEqualZero")
      ),
  });

type CreateResourceGroupForm = z.infer<
  ReturnType<typeof createResourceGroupSchema>
>;

type CreateResourceGroupModalProps = {
  onCreate: (data: CreateResourceGroupForm) => Promise<void>;
  isPool?: boolean;
};

const CreateResourceGroupModal: React.FC<CreateResourceGroupModalProps> = ({
  onCreate,
  isPool = false,
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const form = useForm<CreateResourceGroupForm>({
    resolver: zodResolver(createResourceGroupSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      maxRentTime: 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onCreate({
      name: data.name,
      description: data.description !== "" ? data.description : undefined,
      maxRentTime: data.maxRentTime ?? 0,
    });
    close();
    form.reset();
  });

  return (
    <Dialog
      open={isOpen("createResourceGroup")}
      onOpenChange={() => {
        close();
        form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isPool
              ? t("createResourceGroupModal.titleStateless")
              : t("createResourceGroupModal.titleStateful")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createResourceGroupModal.name")}</FormLabel>
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
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupModal.description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPool} />
                  </FormControl>
                  {isPool && (
                    <FormDescription>
                      {t("createResourceGroupModal.descriptionInPoolWarning")}
                    </FormDescription>
                  )}
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
                    {t("createResourceGroupModal.maxRentTime")}
                  </FormLabel>
                  <FormControl>
                    <RentTimeSelector
                      value={field.value?.toString() ?? ""}
                      onChange={field.onChange}
                      disabled={isPool}
                      start={0}
                      stop={4 * 60}
                      step={20}
                    />
                  </FormControl>
                  <FormDescription>
                    {isPool ? (
                      t("createResourceGroupModal.maxRentTimeInPoolWarning")
                    ) : (
                      <>
                        <p>
                          {t("createResourceGroupModal.maxRentTimeDescription")}
                        </p>
                        <p>
                          {t(
                            "createResourceGroupModal.maxRentTimeDescription2"
                          )}
                        </p>
                      </>
                    )}
                  </FormDescription>
                  <FormMessage />
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
              <Button type="submit">
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

export default CreateResourceGroupModal;
