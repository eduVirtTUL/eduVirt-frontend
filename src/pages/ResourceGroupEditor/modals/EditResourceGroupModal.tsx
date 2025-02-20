import RentTimeSelector from "@/components/RentTimeSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useResourceGroup } from "@/data/resourceGroup/useResourceGroup";
import { useUpdateResourceGroup } from "@/data/resourceGroup/useUpdateResourceGroup";
import { useDialog } from "@/stores/dialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import { SaveIcon, XCircleIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type EditResourceGroupModalProps = {
  rgId: string;
};

const editResourceGroupModalSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("editResourceGroupModal.validation.nameRequired"))
      .max(50, t("editResourceGroupModal.validation.nameMaxLenght")),
    description: z
      .string()
      .max(1000, t("editResourceGroupModal.validation.descriptionMaxLenght"))
      .optional(),
    maxRentTime: z.coerce
      .number()
      .min(
        0,
        t("editResourceGroupModal.validation.maxRentTimeGreaterOrEqualZero")
      ),
  });

type EditResourceGroupModal = z.infer<
  ReturnType<typeof editResourceGroupModalSchema>
>;

const EditResourceGroupModal: React.FC<EditResourceGroupModalProps> = ({
  rgId,
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { resourceGroup, etag } = useResourceGroup(rgId);
  const form = useForm<EditResourceGroupModal>({
    resolver: zodResolver(editResourceGroupModalSchema(t)),
    values: {
      name: resourceGroup?.name ?? "",
      description: resourceGroup?.description ?? "",
      maxRentTime: resourceGroup?.maxRentTime ?? 0,
    },
  });
  const { updateResourceGroupAsync } = useUpdateResourceGroup();

  const handleSubmit = form.handleSubmit(async (data) => {
    await updateResourceGroupAsync({
      id: rgId,
      etag: etag ?? "",
      ...data,
      description: data.description === "" ? undefined : data.description,
    });
    close();
  });

  return (
    <Dialog open={isOpen("editResourceGroup")} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editResourceGroupModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("editResourceGroupModal.name")}</FormLabel>
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
                    {t("editResourceGroupModal.description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={resourceGroup?.stateless} />
                  </FormControl>
                  {resourceGroup?.stateless && (
                    <FormDescription>
                      {t("editResourceGroupModal.descriptionInPoolWarning")}
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
                    {t("editResourceGroupModal.maxRentTime")}
                  </FormLabel>
                  <FormControl>
                    <RentTimeSelector
                      value={field.value?.toString() ?? ""}
                      onChange={field.onChange}
                      disabled={resourceGroup?.stateless}
                      start={0}
                      stop={4 * 60}
                      step={20}
                    />
                  </FormControl>
                  {resourceGroup?.stateless && (
                    <FormDescription>
                      {t("editResourceGroupModal.maxRentTimeInPoolWarning")}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  close();
                }}
              >
                <XCircleIcon />
                {t("cancel")}
              </Button>
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

export default EditResourceGroupModal;
