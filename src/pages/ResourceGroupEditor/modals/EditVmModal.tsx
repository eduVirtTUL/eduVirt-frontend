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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useVm } from "@/data/resourceGroup/useResourceGroupVm";
import { useEditVm } from "@/data/resourceGroup/vm/useEditVm";
import { useDialog } from "@/stores/dialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type EditVmModalProps = {
  vmId: string;
};

const editVmModalSchema = z.object({
  hidden: z.boolean(),
});

type EditVmModalSchema = z.infer<typeof editVmModalSchema>;

const EditVmModal: React.FC<EditVmModalProps> = ({ vmId }) => {
  const { vm, etag } = useVm(vmId);
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { editVmAsync } = useEditVm();
  const form = useForm<EditVmModalSchema>({
    resolver: zodResolver(editVmModalSchema),
    values: {
      hidden: vm?.hidden ?? false,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await editVmAsync({
      id: vmId,
      etag: etag ?? "",
      ...values,
    });
    form.reset();
    close();
  });

  return (
    <Dialog
      open={isOpen("editVm")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editVmModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="hidden"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between border rounded-lg p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("editVmModal.hidden")}
                    </FormLabel>
                    <FormDescription>
                      {t("editVmModal.hiddenDescription")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <Button type="button" variant="secondary">
                {t("cancel")}
              </Button>
              <Button type="submit">
                {t("save")}
                <SaveIcon />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVmModal;
