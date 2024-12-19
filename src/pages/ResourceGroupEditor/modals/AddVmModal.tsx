import { VmDto } from "@/api";
import DataTable from "@/components/DataTable";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAddResourceGroupVm } from "@/data/resourceGroup/useAddResourceGroupVm";
import { useVms } from "@/data/resources/useVms";
import { cn } from "@/lib/utils";
import { useDialog } from "@/stores/dialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleXIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const columns = (form: UseFormReturn<AddVmSchema>): ColumnDef<VmDto>[] => [
  {
    id: "select",
    cell: ({ row }) => {
      const vm = row.original;
      return (
        <RadioGroupItem
          value={vm.id ?? ""}
          checked={form.getValues("id") === vm.id}
        />
      );
    },
  },
  {
    header: "Name",
    accessorKey: "name",
  },
];

type AddVmProps = {
  id: string;
};

const addVmSchema = z.object({
  id: z.string().min(1),
  hidden: z.boolean(),
});

type AddVmSchema = z.infer<typeof addVmSchema>;

const AddVmModal: React.FC<AddVmProps> = ({ id }) => {
  const { close, isOpen } = useDialog();
  const { addVm } = useAddResourceGroupVm(id);
  const { vms } = useVms();
  const form = useForm<AddVmSchema>({
    resolver: zodResolver(addVmSchema),
    defaultValues: {
      id: "",
      hidden: false,
    },
  });

  const [tab, setTab] = React.useState("first");

  const handleSubmit = form.handleSubmit((value) => {
    addVm(value);
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
          <DialogTitle>Add Virtual Machine to Resource Group</DialogTitle>
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
                        <RadioGroup onValueChange={field.onChange}>
                          <DataTable
                            columns={columns(form)}
                            data={vms ?? []}
                            onRowClick={(row) => {
                              field.onChange(row.original.id);
                            }}
                            paginationEnabled
                            pageSize={5}
                          />
                        </RadioGroup>
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
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={!form.getValues("id")}
                    onClick={() => {
                      setTab("second");
                    }}
                  >
                    Next
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
                {/* <h2>(2/2) Settings</h2> */}
                <FormField
                  control={form.control}
                  name="hidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between border rounded-lg p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hidden</FormLabel>
                        <FormDescription>
                          If checked, the virtual machine will be hidden from
                          the user.
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
                    Back
                  </Button>
                  <Button type="submit">
                    Add
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
