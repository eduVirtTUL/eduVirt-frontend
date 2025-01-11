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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAddResourceGroupVm } from "@/data/resourceGroup/useAddResourceGroupVm";
import { cn } from "@/lib/utils";
import { useDialog } from "@/stores/dialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleXIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AvailableMachinesList from "../components/AvailableMachinesList";
import { useTranslation } from "react-i18next";

type AddVmProps = {
  id: string;
};

const addVmSchema = z.object({
  id: z.string().min(1),
  hidden: z.boolean(),
});

type AddVmSchema = z.infer<typeof addVmSchema>;

const AddVmModal: React.FC<AddVmProps> = ({ id }) => {
  const { t } = useTranslation();
  const { close, isOpen } = useDialog();
  const { addVm } = useAddResourceGroupVm(id);
  const form = useForm<AddVmSchema>({
    resolver: zodResolver(addVmSchema),
    defaultValues: {
      id: "",
      hidden: false,
    },
  });

  const [tab, setTab] = React.useState<"first" | "second">("first");

  const handleSubmit = form.handleSubmit((value) => {
    addVm(value);
    form.reset();
    setTab("first");
    close();
  });

  return (
    <Dialog
      open={isOpen("addVmToResourceGroup")}
      onOpenChange={() => {
        form.reset();
        setTab("first");
        close();
      }}
    >
      <DialogContent className="h-[540px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("addVmModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="h-full flex-1">
            <Tabs value={tab} className="h-full">
              <TabsContent
                value="first"
                className={cn(
                  "flex flex-col gap-4 justify-between",
                  tab === "first" && "h-full"
                )}
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AvailableMachinesList
                          onValueChange={field.onChange}
                          id={id}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => close()}
                  >
                    <CircleXIcon />
                    {t("cancel")}
                  </Button>
                  <Button
                    type="button"
                    disabled={!form.getValues("id")}
                    onClick={() => {
                      setTab("second");
                    }}
                  >
                    {t("next")}
                    <ArrowRightIcon />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="second"
                className={cn(
                  "flex flex-col gap-4 justify-between mt-0",
                  tab === "second" && "h-full"
                )}
              >
                <FormField
                  control={form.control}
                  name="hidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between border rounded-lg p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("addVmModal.hidden")}
                        </FormLabel>
                        <FormDescription>
                          {t("addVmModal.hiddenDescription")}
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
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setTab("first")}
                  >
                    <ArrowLeftIcon />
                    {t("previous")}
                  </Button>
                  <Button type="submit">
                    {t("add")}
                    <PlusIcon />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVmModal;
