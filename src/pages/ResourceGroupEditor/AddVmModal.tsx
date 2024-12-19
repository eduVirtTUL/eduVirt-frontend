import { VmDto } from "@/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAddResourceGroupVm } from "@/data/resourceGroup/useAddResourceGroupVm";
import { useVms } from "@/data/resources/useVms";
import { cn } from "@/lib/utils";
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
  name: z.string().optional(),
  id: z.string().min(1),
  hidden: z.boolean(),
});

type AddVmSchema = z.infer<typeof addVmSchema>;

const AddVmModal: React.FC<AddVmProps> = ({ id }) => {
  const { addVm } = useAddResourceGroupVm(id);
  const { vms } = useVms();
  const form = useForm<AddVmSchema>({
    resolver: zodResolver(addVmSchema),
    defaultValues: {
      name: "",
      id: "",
      hidden: false,
    },
  });

  const [tab, setTab] = React.useState("first");

  const handleSubmit = form.handleSubmit((value) => {
    addVm(value);
  });

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        setTab("first");
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Virtual Machine</Button>
      </DialogTrigger>
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
                <h2>(1/2) Pick Virtual Machine</h2>
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
                  <Button type="button" variant="secondary">
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
                  "flex flex-col gap-4 justify-start",
                  tab === "second" && "h-full"
                )}
              >
                <h2>(2/2) Settings</h2>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

        {/* <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual machine</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? vms?.find((vm) => vm.id === field.value)?.name
                            : "Select Vm"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search vms..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {vms?.map((vm) => (
                              <CommandItem
                                value={vm.name}
                                key={vm.id}
                                onSelect={() => {
                                  form.setValue("id", vm.id ?? "");
                                }}
                              >
                                {vm.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    vm.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            ></FormField> */}
      </DialogContent>
    </Dialog>
  );
};

export default AddVmModal;
